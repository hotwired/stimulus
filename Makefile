SENTINELLA_SRC := $(wildcard src/sentinella/*.ts) src/sentinella/tsconfig.json package.json rollup.config.js
TEST_SRC := $(wildcard src/test/*.ts) src/test/tsconfig.json
SRC := $(SENTINELLA_SRC) $(TEST_SRC)

ROLLUP := node_modules/rollup/bin/rollup
BUBLE	 := node_modules/buble/bin/buble
TSLINT := node_modules/tslint/bin/tslint
TSC		 := node_modules/typescript/bin/tsc
TESTEM := node_modules/testem/testem.js

default: dist

clean:
	rm -fr build/sentinella build/test dist/*.js

all: dist test

dist: dist/sentinella.js

test: dist build/test

testem: test
	$(TESTEM)

$(SRC): ;

dist/sentinella.js: build/sentinella
	$(ROLLUP) -c | $(BUBLE) --yes dangerousForOf > dist/sentinella.js

build/sentinella/index.js: $(SENTINELLA_SRC)
	$(TSLINT) src/sentinella/*.ts
	rm -fr build/sentinella
	$(TSC) -d -p src/sentinella
	mv build/sentinella/index.d.ts{,.orig}

build/sentinella/index.d.ts: build/sentinella/index.js build/sentinella/index.d.ts.orig
	cp build/sentinella/index.d.ts{.orig,}
	echo "export as namespace Sentinella;" >> build/sentinella/index.d.ts
	echo "export { Router };" >> build/sentinella/index.d.ts

build/sentinella: build/sentinella/index.js build/sentinella/index.d.ts

build/test/index.js: $(TEST_SRC)
	$(TSLINT) src/test/*.ts
	rm -fr build/test
	$(TSC) -p src/test

build/test: build/test/index.js
