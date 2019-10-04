## [2.0.4](https://github.com/parkerself22/mui-table/compare/v2.0.3...v2.0.4) (2019-03-08)


### Bug Fixes

* **Styles:** Fixed an issue with the no data row and made sure all components have style keys for ov ([9567f3c](https://github.com/parkerself22/mui-table/commit/9567f3c))

## [2.0.3](https://github.com/parkerself22/mui-table/compare/v2.0.2...v2.0.3) (2019-03-05)


### Bug Fixes

* **customToolbarBottom option:** Fix an issue with styling ([e4e7074](https://github.com/parkerself22/mui-table/commit/e4e7074))

## [2.0.2](https://github.com/parkerself22/mui-table/compare/v2.0.1...v2.0.2) (2019-02-28)


### Bug Fixes

* **ColumnFilters:** The removal of filter: false columns threw off column filter indexes ([3909773](https://github.com/parkerself22/mui-table/commit/3909773))

## [2.0.1](https://github.com/parkerself22/mui-table/compare/v2.0.0...v2.0.1) (2019-02-28)


### Bug Fixes

* **Fixed header and column options:** The fixed header was only rendering at 25% of toolbar when sho ([bdab0a9](https://github.com/parkerself22/mui-table/commit/bdab0a9))

# [2.0.0](https://github.com/parkerself22/mui-table/compare/v1.1.0...v2.0.0) (2019-02-22)


### Bug Fixes

* **MUITableToolbarSelect && Options:** Renamed a few of the options for clarity. Fixed the fact that ([5a4681f](https://github.com/parkerself22/mui-table/commit/5a4681f))


### BREAKING CHANGES

* **MUITableToolbarSelect && Options:** Renamed hiddenColumnsMergeDuplicates row option to hiddenColumnMerge. Added context
as an argument to customToolbarSelect function.

# [1.1.0](https://github.com/parkerself22/mui-table/compare/v1.0.12...v1.1.0) (2019-02-22)


### Features

* **fixedSearch in header, more custom toolbar options, tests:** Added an ever-present searchbar options for the header. Added more custom toolbar hooks. + test coverage for all. ([06802bc](https://github.com/parkerself22/mui-table/commit/06802bc))

## [1.0.12](https://github.com/parkerself22/mui-table/compare/v1.0.11...v1.0.12) (2019-02-20)


### Bug Fixes

* **hooks, mergeRows, test coverage:** Fixed support for firing all hooks. Added row duplicate filtering and merging options to row props. Increased test coverage up to 100% ([5d19848](https://github.com/parkerself22/mui-table/commit/5d19848))

## [1.0.11](https://github.com/parkerself22/mui-table/compare/v1.0.10...v1.0.11) (2019-02-15)


### Bug Fixes

* **add LICENSE:** add license ([7348b2a](https://github.com/parkerself22/mui-table/commit/7348b2a))
* **documentation:** add better documentation ([e5c7fa8](https://github.com/parkerself22/mui-table/commit/e5c7fa8))
* **license + package.json:** fix typo, update docs ([255cf1a](https://github.com/parkerself22/mui-table/commit/255cf1a))
* **release config:** turns out renaming the repo wasn't the best call ([4ec74f9](https://github.com/parkerself22/mui-table/commit/4ec74f9))

## [1.0.10](https://github.com/parkerself22/mui-table/compare/v1.0.9...v1.0.10) (2019-02-15)


### Bug Fixes

* **testing dependencies:** Ignore devDependencies because last push passed due to module in dev when it should have been in deps. ([cb30a4d](https://github.com/parkerself22/mui-table/commit/cb30a4d))

## [1.0.9](https://github.com/parkerself22/mui-table/compare/v1.0.8...v1.0.9) (2019-02-15)


### Bug Fixes

* **testing dependencies:** add a dependency check test using depcheck ([cc84cda](https://github.com/parkerself22/mui-table/commit/cc84cda))

## [1.0.8](https://github.com/parkerself22/mui-table/compare/v1.0.7...v1.0.8) (2019-02-14)


### Bug Fixes

* **exports & ts-config:** mistakenly had jsx: "preserve" when it should be compiled for the package ([9d0fda5](https://github.com/parkerself22/mui-table/commit/9d0fda5))

## [1.0.7](https://github.com/parkerself22/mui-table/compare/v1.0.6...v1.0.7) (2019-02-14)


### Bug Fixes

* **changelog:** update changelog ([0a4d749](https://github.com/parkerself22/mui-table/commit/0a4d749))
* **exports & config:** did not have typings generated for dist ([5587ede](https://github.com/parkerself22/mui-table/commit/5587ede))

## [1.0.6](https://github.com/parkerself22/mui-table/compare/v1.0.5...v1.0.6) (2019-02-14)


### Bug Fixes

* **release config:** this should make sure the package repo is updated ([ecaa249](https://github.com/parkerself22/mui-table/commit/ecaa249))

## [1.0.5](https://github.com/parkerself22/mui-table/compare/v1.0.4...v1.0.5) (2019-02-14)


### Bug Fixes

* **style config:** fix prettier and ts-lint configs ([8ebeecc](https://github.com/parkerself22/mui-table/commit/8ebeecc))
* **ts-lint:** fix prettier and ts-lint configs ([e065980](https://github.com/parkerself22/mui-table/commit/e065980))
* **ts-lint:** fix ts-lint config ([bce4da3](https://github.com/parkerself22/mui-table/commit/bce4da3))
* **ts-lint:** fix ts-lint config and make sure deps are setup after removing lodash ([89b28de](https://github.com/parkerself22/mui-table/commit/89b28de))


## [1.0.4](https://github.com/parkerself22/mui-table/compare/v1.0.3...v1.0.4) (2019-02-14)


### Bug Fixes

* **ts-lint:** tslint config was throwing errors ([65057f1](https://github.com/parkerself22/mui-table/commit/65057f1))

## [1.0.3](https://github.com/parkerself22/mui-table/compare/v1.0.2...v1.0.3) (2019-02-14)


### Bug Fixes

* **default export, tests, stories:** lots of tests in here, the big change though is the default export is fixed... probably should have checked that before publish... ([c45fa81](https://github.com/parkerself22/mui-table/commit/c45fa81))
* **test utils:** needed to call afterAll(sandbox.restore) for anywhere sinon was stubbing out functions. Caused an error in CI that was not thrown when running each test file individually. ([4e2874a](https://github.com/parkerself22/mui-table/commit/4e2874a))
* **tests:** more test coverage ([914af7d](https://github.com/parkerself22/mui-table/commit/914af7d))

## [1.0.2](https://github.com/parkerself22/mui-table/compare/v1.0.1...v1.0.2) (2019-02-11)


### Bug Fixes

* **docs:** update docs ([763e1f0](https://github.com/parkerself22/mui-table/commit/763e1f0))

## [1.0.1](https://github.com/parkerself22/mui-table/compare/v1.0.0...v1.0.1) (2019-02-11)


### Bug Fixes

* **.gitignore:** hopefully everything should run right now ([7b205cd](https://github.com/parkerself22/mui-table/commit/7b205cd))
* **codecov:** fix the coverage config ([da18c20](https://github.com/parkerself22/mui-table/commit/da18c20))
