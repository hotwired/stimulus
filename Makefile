SENTINELLA_SRC := $(wildcard src/sentinella/*.ts) src/sentinella/tsconfig.json package.json rollup.config.js
TEST_SRC := $(wildcard src/test/*.ts) src/test/tsconfig.json

ROLLUP := node_modules/rollup/bin/rollup
BUBLE  := node_modules/buble/bin/buble
TSLINT := node_modules/tslint/bin/tslint
TSC    := node_modules/typescript/bin/tsc
TESTEM := node_modules/testem/testem.js

default: dist

all: dist test

dist: dist/sentinella.js

sentinella: build/sentinella/index.js build/sentinella/index.d.ts

test: build/test/index.js

testem: test
	$(TESTEM)

dist/sentinella.js: sentinella
	$(ROLLUP) -c | $(BUBLE) --yes dangerousForOf > dist/sentinella.js

build/sentinella/index.js: $(SENTINELLA_SRC)
	$(TSLINT) src/sentinella/*.ts
	$(TSC) -d -p src/sentinella
	mv build/sentinella/index.d.ts{,.orig}

build/sentinella/index.d.ts: build/sentinella/index.js build/sentinella/index.d.ts.orig
	cp build/sentinella/index.d.ts{.orig,}
	echo "export as namespace Sentinella;" >> build/sentinella/index.d.ts
	echo "export { Router };" >> build/sentinella/index.d.ts

build/test/index.js: dist/sentinella.js $(TEST_SRC)
	$(TSLINT) src/test/*.ts
	$(TSC) -p src/test

clean:
	rm -fr build/sentinella build/test dist/*.js
