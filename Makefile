SENTINELLA_SRC := $(wildcard src/sentinella/*.ts) src/sentinella/tsconfig.json package.json rollup.config.js

ROLLUP := node_modules/rollup/bin/rollup
TSLINT := node_modules/tslint/bin/tslint
TSC := node_modules/typescript/bin/tsc

default: dist

all: dist

dist: dist/sentinella.js

dist/sentinella.js: build/sentinella/index.js
	$(ROLLUP) -c

build/sentinella/index.js: $(SENTINELLA_SRC)
	$(TSLINT) src/sentinella/*.ts
	$(TSC) -d -p src/sentinella

clean:
	rm -fr build/sentinella dist/*.js
