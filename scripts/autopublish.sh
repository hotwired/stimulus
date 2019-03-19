#!/usr/bin/env bash
set -e
_IFS="$IFS"

if [ -z "$TMPDIR" ]; then
  TMPDIR="/tmp"
else
  TMPDIR="${TMPDIR%/}"
fi

package-name() {
  node -e "
    const package = JSON.parse(fs.readFileSync('package.json'))
    console.log(package.name)
  "
}

rewrite-package-json() {
  url="https://github.com/${AUTOPUBLISH_PACKAGE_REPO}/archive/${sha}/" \
  packageList="$package_list" node -e "
    const package = JSON.parse(fs.readFileSync('package.json'))
    if (package.dependencies) {
      const packageNames = JSON.parse(process.env.packageList).map(_ => _.name)
      for (const name in package.dependencies)
        if (packageNames.indexOf(name) != -1)
          package.dependencies[name] = process.env.url + name + '.tar.gz'
      fs.writeFileSync('package.json', JSON.stringify(package))
    }
  "
}

# Ensure the environment is complete
for name in NAME EMAIL GITHUB_USER GITHUB_TOKEN PACKAGE_REPO SOURCE_REPO BRANCH COMMIT; do
  var="AUTOPUBLISH_${name}"
  : ${!var?"Please set $var"}
done

# Create the root temporary directory
ROOT="$TMPDIR/autopublish.$$"
mkdir -p "$ROOT"
pushd "$ROOT"

# Set up git credentials
git config --global credential.helper "store --file=${ROOT}/.git-credentials"
git config --global credential.username "$AUTOPUBLISH_GITHUB_USER"
echo "https://${AUTOPUBLISH_GITHUB_USER}:${AUTOPUBLISH_GITHUB_TOKEN}@github.com" > .git-credentials

# Set up and build the source repo
mkdir -p "$AUTOPUBLISH_SOURCE_REPO"
pushd "$AUTOPUBLISH_SOURCE_REPO"
  git init
  git remote add origin "https://github.com/${AUTOPUBLISH_SOURCE_REPO}.git"
  git fetch --depth 1 origin "$AUTOPUBLISH_COMMIT"
  git reset --hard "$AUTOPUBLISH_COMMIT"
  yarn install
  yarn build
  IFS=$'\n'
    package_list="$(yarn -s lerna list --json 2>/dev/null)"
    package_paths=( $(yarn -s lerna exec pwd 2>/dev/null) )
  IFS="$_IFS"
popd

# Set up the package repo
mkdir -p "$AUTOPUBLISH_PACKAGE_REPO"
pushd "$AUTOPUBLISH_PACKAGE_REPO"
  git init
  git remote add origin "https://github.com/${AUTOPUBLISH_PACKAGE_REPO}.git"
popd

# Create the commits
for path in "${package_paths[@]}"; do
  pushd "$path"
    name="$(package-name)"
    subject="$(git log -n 1 --format=format:%s)"
    date="$(git log -n 1 --format=format:%ai)"
    url="https://github.com/${AUTOPUBLISH_SOURCE_REPO}/tree/${AUTOPUBLISH_COMMIT}"
    sha="${AUTOPUBLISH_COMMIT:0:7}"
    tag="${sha}/${name}"
    message="$tag $subject"$'\n'$'\n'"$url"
  popd
  pushd "$AUTOPUBLISH_PACKAGE_REPO"
    git symbolic-ref HEAD refs/heads/build
    shopt -s nullglob
      cp -R "$path"/{*.json,*.js,dist} . || true
    shopt -u nullglob
    rewrite-package-json
    git add .
    GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" \
    GIT_AUTHOR_NAME="$AUTOPUBLISH_NAME" GIT_COMMITTER_NAME="$AUTOPUBLISH_NAME" \
    GIT_AUTHOR_EMAIL="$AUTOPUBLISH_EMAIL" GIT_COMMITTER_EMAIL="$AUTOPUBLISH_EMAIL" \
      git commit -m "$message"
    git tag "$tag"
    git symbolic-ref HEAD refs/heads/master
    rm -f .git/index
    git clean -dfx
    git branch -D build
  popd
done

# Push
pushd "$AUTOPUBLISH_PACKAGE_REPO"
  git push -f --tags
popd

# Clean up
popd
rm -fr "$ROOT"
echo Done
