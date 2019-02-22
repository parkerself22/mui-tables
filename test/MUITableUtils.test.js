"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var sinon_1 = require("sinon");
var constants_1 = require("../src/constants");
var MUITableUtils_1 = require("../src/constants/MUITableUtils");
var sandbox = sinon_1["default"].createSandbox();
afterAll(sandbox.restore);
describe('MUITableUtils', function () {
    afterEach(function () {
        sandbox.restore();
    });
    describe("MUITableUtils.formatSeconds", function () {
        var timeTests = [
            [0, '0:00'],
            [59, '0:00'],
            [60, '0:01'],
            [3599, '0:59'],
            [3600, '1:00'],
            [3661, '1:01'],
            [35959, '9:59'],
            [36000, '10:00'],
            [36060, '10:01'] // 10 hours 1 minute
        ];
        it.each(timeTests)("formats %i seconds into %s", function (secs, text) {
            var result = MUITableUtils_1["default"].formatSeconds(secs);
            expect(result).toBe(text);
        });
    });
    describe("MUITableUtils.formatValue", function () {
        var tests = [
            [2.25, 'float', '2.25'],
            [2.25, 'integer', '2'],
            [60, 'seconds', '0:01'],
            [60, 'minutes', '1:00'],
            [5, 'hours', '5:00']
        ];
        test.each(tests)("formats %i %s into %s", function (val, format, expected) {
            var result = MUITableUtils_1["default"].formatValue(val, format);
            expect(result).toBe(expected);
        });
    });
    describe("MUITableUtils.formatColumnValue", function () {
        var tests = [
            [
                2.25,
                'Postfix',
                '2.25 Postfix',
                {
                    name: 'test',
                    summaryOptions: {
                        postfix: ' Postfix'
                    }
                }
            ],
            [
                2.25,
                'Prefix',
                'Prefix 2.25',
                {
                    name: 'test',
                    summaryOptions: {
                        prefix: 'Prefix '
                    }
                }
            ],
            [
                2.25,
                'Prefix & Postfix',
                'Prefix 2.25 Postfix',
                {
                    name: 'test',
                    summaryOptions: {
                        prefix: 'Prefix ',
                        postfix: ' Postfix'
                    }
                }
            ]
        ];
        test.each(tests)("formats %i with %s into \"%s\"", function (val, title, expected, col) {
            var result = MUITableUtils_1["default"].formatColumnValue(val, col);
            expect(result).toBe(expected);
        });
    });
    describe("MUITableUtils.sumColumnCell", function () {
        var tests = [
            // value, case, cell, expected
            [1, 'cell with value', { value: 1 }, 2],
            [1, 'cell without value', {}, 1],
            [1, 'NaN cell', { value: NaN }, 1],
            [1, 'String cell value', { value: '1' }, 2]
        ];
        test.each(tests)("sums %i %s into %s", function (val, testCase, cell, expected) {
            var result = MUITableUtils_1["default"].sumColumnCell(val, cell);
            expect(result).toBe(expected);
        });
    });
    describe("MUITableUtils.validateCustomSummaryCell", function () {
        test('throws when not an object', function () {
            expect(function () {
                MUITableUtils_1["default"].validateCustomSummaryCell('');
            }).toThrow();
        });
        test('throws when missing top level props', function () {
            var missingProps = {
                total: {}
            };
            expect(function () {
                MUITableUtils_1["default"].validateCustomSummaryCell(missingProps);
            }).toThrow();
        });
        test('throws when missing nested props', function () {
            var missingProps = {
                total: {},
                visible: {
                    value: 1
                }
            };
            expect(function () {
                MUITableUtils_1["default"].validateCustomSummaryCell(missingProps);
            }).toThrow();
        });
    });
    describe("MUITableUtils.calculateSummaryRow", function () {
        var displayRows = [[{ value: 1, display: '1', column: {} }]];
        var allRows = displayRows.slice();
        test('console.errors for custom calculate columns errors', function () {
            var calcResult = '';
            var calcSpy = sandbox.spy(function (displayRows, allRows) { return calcResult; });
            var cols = [
                __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', summary: true, calculateCellDefinition: function (entry) { return ({ value: 1, display: '1' }); }, summaryOptions: {
                        type: 'SUM',
                        format: 'integer',
                        customCalculate: calcSpy
                    } })
            ];
            var consoleSpy = sandbox.stub(console, 'error');
            MUITableUtils_1["default"].calculateSummaryRow(displayRows, allRows, cols);
            expect(consoleSpy.callCount).toBe(3);
            consoleSpy.restore();
        });
        test('uses custom calculate columns', function () {
            var calcResult = {
                total: { value: 1, display: '1', column: {} },
                visible: { value: 1, display: '1', column: {} }
            };
            var calcSpy = sandbox.spy(function (displayRows, allRows) { return calcResult; });
            var cols = [
                __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', summary: true, calculateCellDefinition: function (entry) { return ({ value: 1, display: '1' }); }, summaryOptions: {
                        type: 'SUM',
                        format: 'integer',
                        customCalculate: calcSpy
                    } })
            ];
            var result = MUITableUtils_1["default"].calculateSummaryRow(displayRows, allRows, cols);
            expect(calcSpy.callCount).toBe(1);
            expect(result[0]).toMatchObject(calcResult);
        });
        test('returns null cell for summary: false column', function () {
            var cols = [
                __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', summary: false })
            ];
            var result = MUITableUtils_1["default"].calculateSummaryRow(displayRows, allRows, cols);
            result.forEach(function (r) {
                expect(r.visible.value).toBe(null);
                expect(r.total.value).toBe(null);
                expect(r.visible.display).toBe('');
                expect(r.total.display).toBe('');
            });
        });
        test('returns null cell for type: dimension column', function () {
            var cols = [
                __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'dimension', summary: true })
            ];
            var result = MUITableUtils_1["default"].calculateSummaryRow(displayRows, allRows, cols);
            result.forEach(function (r) {
                expect(r.visible.value).toBe(null);
                expect(r.total.value).toBe(null);
                expect(r.visible.display).toBe('');
                expect(r.total.display).toBe('');
            });
        });
        test('SUMS rows by default', function () {
            var cols = [
                __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', summary: true, calculateCellDefinition: function (entry) { return ({ display: '1', value: 1 }); } })
            ];
            var result = MUITableUtils_1["default"].calculateSummaryRow(displayRows, allRows, cols);
            result.forEach(function (r) {
                expect(r.visible.value).toBe(1);
                expect(r.total.value).toBe(1);
                expect(r.visible.display).toBe('1.00');
                expect(r.total.display).toBe('1.00');
            });
        });
        test('AVGs rows correctly', function () {
            var cols = [
                __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', summary: true, summaryOptions: {
                        format: 'float',
                        type: 'AVG'
                    }, calculateCellDefinition: function (entry) { return ({ display: '1.00', value: 1 }); } })
            ];
            var newRows = displayRows.slice();
            var result = MUITableUtils_1["default"].calculateSummaryRow(newRows, newRows, cols);
            result.forEach(function (r) {
                expect(r.visible.value).toBe(1);
                expect(r.total.value).toBe(1);
                expect(r.visible.display).toBe('1.00');
                expect(r.total.display).toBe('1.00');
            });
        });
    });
    describe("MUITableUtils.sortRows", function () {
        var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric' });
        var rows = [
            [{ value: 1, display: '1', column: col }],
            [{ value: 2, display: '2', column: col }]
        ];
        var state = {
            displayRows: [],
            columnFilters: [],
            selectedRows: [],
            search: {
                open: false,
                text: null
            },
            viewColumns: [true],
            sortColumn: {
                index: null,
                asc: false
            },
            pagination: {
                page: 0,
                rowsPerPage: 5,
                rowsPerPageOptions: [5, 10, 15]
            }
        };
        test('Returns rows in same order when sort index is null', function () {
            var testState = __assign({}, state);
            var result = MUITableUtils_1["default"].sortRows(rows, testState, [col]);
            expect(result[0][0].value).toBe(1);
            expect(result[1][0].value).toBe(2);
        });
        test('Handles rows with string', function () {
            var testRows = [
                [{ value: '1', display: '1', column: col }],
                [{ value: '2', display: '2', column: col }]
            ];
            var testState = __assign({}, state, { sortColumn: { index: 0, asc: true } });
            var result = MUITableUtils_1["default"].sortRows(testRows, testState, [col]);
            expect(result[0][0].value).toBe('1');
            expect(result[1][0].value).toBe('2');
        });
        test('Returns rows in correct order when sort.asc is true', function () {
            var testState = __assign({}, state, { sortColumn: { index: 0, asc: true } });
            var result = MUITableUtils_1["default"].sortRows(rows, testState, [col]);
            expect(result[0][0].value).toBe(1);
            expect(result[1][0].value).toBe(2);
        });
        test('Returns rows in correct order when sort.asc is false', function () {
            var testState = __assign({}, state, { sortColumn: { index: 0, asc: false } });
            var result = MUITableUtils_1["default"].sortRows(rows, testState, [col]);
            expect(result[0][0].value).toBe(2);
            expect(result[1][0].value).toBe(1);
        });
        test('Handles singleRow with value', function () {
            var column = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric' });
            var testState = __assign({}, state, { sortColumn: { index: 0, asc: false } });
            var errorRows = [[], [{ value: 1, display: '1', column: col }]];
            var result = MUITableUtils_1["default"].sortRows(errorRows, testState, [column]);
            var rowsWithCells = result.filter(function (r) { return r.length > 0; });
            expect(rowsWithCells.length).toBe(1);
        });
    });
    describe("MUITableUtils.filterRows", function () {
        var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric' });
        var rows = [
            [{ value: 1, display: '1', column: col }],
            [{ value: 2, display: '2', column: col }]
        ];
        var state = {
            displayRows: [],
            columnFilters: [],
            selectedRows: [],
            search: {
                open: false,
                text: null
            },
            viewColumns: [true],
            sortColumn: {
                index: null,
                asc: false
            },
            pagination: {
                page: 0,
                rowsPerPage: 5,
                rowsPerPageOptions: [5, 10, 15]
            }
        };
        test("It doesn't filter when opts.display.filter = false", function () {
            var testRows = rows.slice();
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { filter: false }) });
            var spy = sandbox.stub(testRows, 'reduce');
            MUITableUtils_1["default"].filterRows(rows, state, opts, [col]);
            expect(spy.callCount).toBe(0);
        });
        test('It handles rows that dont have cells for all columns', function () {
            var testRows = [rows[0], [{}], [null]];
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { filter: true }) });
            var testState = __assign({}, state, { columnFilters: [['12']] });
            var tester = function () { return MUITableUtils_1["default"].filterRows(testRows, testState, opts, [col]); };
            expect(tester).not.toThrow();
        });
        test('It handles columns with no active filters', function () {
            var testRows = [
                [{ value: 1, display: '1', column: col }, { value: 2, display: '2', column: col }]
            ];
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { filter: true }) });
            var testState = __assign({}, state, { columnFilters: [['12'], []] });
            var tester = function () { return MUITableUtils_1["default"].filterRows(testRows, testState, opts, [col]); };
            expect(tester).not.toThrow();
        });
        test('It filters when opts.display.filter = true', function () {
            var testRows = rows.slice();
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { filter: true }) });
            var testState = __assign({}, state, { columnFilters: [['1']] });
            var spy = sandbox.stub(Array.prototype, 'reduce');
            MUITableUtils_1["default"].filterRows(rows, testState, opts, [col]);
            expect(spy.callCount).toBe(1);
            sandbox.restore();
        });
        test('It only includes exact matches when filterOptions.exact = true', function () {
            var testRows = rows.concat([[{ value: 12, display: '12', column: col }]]);
            var testCol = __assign({}, col, { filterOptions: {
                    exact: true,
                    type: 'multiselect',
                    currentList: []
                } });
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { filter: true }) });
            var testState = __assign({}, state, { columnFilters: [['12']] });
            var result = MUITableUtils_1["default"].filterRows(testRows, testState, opts, [testCol]);
            expect(result[0][0].display).toBe('12');
        });
        test("It includes 'contains' matches when filterOptions.exact = false", function () {
            var testRows = rows.concat([[{ value: 12, display: '12', column: col }]]);
            var testCol = __assign({}, col, { filterOptions: {
                    exact: false,
                    type: 'multiselect',
                    currentList: []
                } });
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { filter: true }) });
            var testState = __assign({}, state, { columnFilters: [['1']] });
            var result = MUITableUtils_1["default"].filterRows(testRows, testState, opts, [testCol]);
            expect(result.length).toBe(2);
        });
    });
    describe("MUITableUtils.searchFilterOk", function () {
        var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric' });
        var state = {
            displayRows: [],
            columnFilters: [],
            selectedRows: [],
            search: {
                open: false,
                text: null
            },
            viewColumns: [true],
            sortColumn: {
                index: null,
                asc: false
            },
            pagination: {
                page: 0,
                rowsPerPage: 5,
                rowsPerPageOptions: [5, 10, 15]
            }
        };
        test('It returns ok = true when search not open', function () {
            var testRow = [{ value: 1, display: '1', column: col }];
            var testState = __assign({}, state, {
                search: {
                    text: ' ',
                    open: false
                }
            });
            var result = MUITableUtils_1["default"].searchFilterOk(testRow, testState);
            expect(result).toBe(true);
        });
        test('It returns ok = true when search text is null', function () {
            var testRow = [{ value: 1, display: '1', column: col }];
            var testState = __assign({}, state, {
                search: {
                    text: null,
                    open: true
                }
            });
            var result = MUITableUtils_1["default"].searchFilterOk(testRow, testState);
            expect(result).toBe(true);
        });
        test('It returns ok = false when search text not in row', function () {
            var testRow = [{ value: 1, display: '1', column: col }];
            var testState = __assign({}, state, {
                search: {
                    text: '2',
                    open: true
                }
            });
            var result = MUITableUtils_1["default"].searchFilterOk(testRow, testState);
            expect(result).toBe(false);
        });
        test('It returns ok = true when search text in the row', function () {
            var testRow = [{ value: 1, display: '1', column: col }];
            var testState = __assign({}, state, {
                search: {
                    text: '1',
                    open: true
                }
            });
            var result = MUITableUtils_1["default"].searchFilterOk(testRow, testState);
            expect(result).toBe(true);
        });
    });
    describe("MUITableUtils.findRowIndexById", function () {
        test('It finds row if its id exists in list', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: true });
            var row = [{ value: 1, display: '1', column: col }];
            var rowId = MUITableUtils_1["default"].rowId(row);
            var list = [rowId];
            expect(MUITableUtils_1["default"].findRowIndex(row, list)).toBe(0);
        });
        test("It doesn't find row if when id not in list", function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: true });
            var row = [{ value: 1, display: '1', column: col }];
            var rowId = MUITableUtils_1["default"].rowId(row);
            var list = [];
            expect(MUITableUtils_1["default"].findRowIndex(row, list)).toBe(-1);
        });
    });
    describe("MUITableUtils.rowId", function () {
        test('It generates random when no isRowId columns passed', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false });
            var row = [{ value: 1, display: '1', column: col }];
            expect(function () { return MUITableUtils_1["default"].rowId(row); }).not.toThrow();
            expect(MUITableUtils_1["default"].rowId(row)).not.toBe('1');
        });
        test('It joins row props to generate id when isRowId = true', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: true });
            var row = [{ value: 1, display: '1', column: col }];
            var exp = '1';
            expect(MUITableUtils_1["default"].rowId(row)).toBe(exp);
        });
    });
    describe("MUITableUtils.buildRows", function () {
        test('It calls calculateCellDefinition', function () {
            var spy = sandbox.spy(function (e) { return ({ display: '1', value: 1 }); });
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: spy });
            var data = [{ value: 1 }];
            var result = MUITableUtils_1["default"].buildRows(data, [col], constants_1.DEFAULT_OPTS);
            expect(spy.callCount).toBe(1);
        });
        test('It calls filterDuplicates if skipDuplicates = true', function () {
            var stub = sandbox
                .stub(MUITableUtils_1["default"], 'filterDuplicates')
                .callsFake(function (rows) { return rows; });
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            MUITableUtils_1["default"].buildRows(data, [constants_1.DEFAULT_COL, col], __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { skipDuplicates: true }) }));
            expect(stub.called).toBe(true);
        });
        test('It calls mergeDuplicates if mergeDuplicates = true', function () {
            var stub = sandbox
                .stub(MUITableUtils_1["default"], 'mergeDuplicates')
                .callsFake(function (rows) { return rows; });
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            MUITableUtils_1["default"].buildRows(data, [constants_1.DEFAULT_COL, col], __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { mergeDuplicates: true, skipDuplicates: false }) }));
            expect(stub.called).toBe(true);
        });
    });
    describe("MUITableUtils.buildOptions", function () {
        test("It doesn't throw", function () {
            var data = [{ value: 1 }];
            var props = {
                data: data,
                title: 't',
                loading: false,
                columns: {
                    static: [],
                    generated: []
                }
            };
            expect(function () { return MUITableUtils_1["default"].buildOptions(props); }).not.toThrow();
        });
    });
    describe("MUITableUtils.buildStaticColumns", function () {
        test("It doesn't throw", function () {
            var data = [{ value: 1 }];
            expect(function () { return MUITableUtils_1["default"].buildStaticColumns(data, []); }).not.toThrow();
        });
    });
    describe("MUITableUtils.buildGeneratedColumns", function () {
        var data = [
            {
                value: 1,
                obj: {
                    entry: {
                        name: 'Generated Column',
                        value: 'test'
                    }
                }
            }
        ];
        var generatedColumn = {
            path: ['obj', 'entry'],
            nameProp: 'name',
            type: 'dimension',
            options: {
                calculateCellDefinition: function (entry) { return ({ display: entry.value, value: entry }); }
            }
        };
        test('It returns the correct column', function () {
            var result = MUITableUtils_1["default"].buildGeneratedColumns([generatedColumn], data);
            expect(result[0].title).toBe('Generated Column');
        });
        test('It handles generateRelated', function () {
            var genCol = __assign({}, generatedColumn, { generateRelatedColumns: function (c, e) { return [{}]; } });
            var test = function () { return MUITableUtils_1["default"].buildGeneratedColumns([genCol], data); };
            expect(test).not.toThrow();
        });
        test('It handles generateRelated not being an array', function () {
            var genCol = __assign({}, generatedColumn, { generateRelatedColumns: function (c, e) { return ({}); } });
            var test = function () { return MUITableUtils_1["default"].buildGeneratedColumns([genCol], data); };
            expect(test).not.toThrow();
        });
        test('It handles inaccessible propsPath', function () {
            var col = __assign({}, generatedColumn, { path: ['doesnt', 'exist'] });
            var test = function () { return MUITableUtils_1["default"].buildGeneratedColumns([col], data); };
            expect(test).not.toThrow();
            var result = test();
            expect(result.length).toBe(0);
        });
        test('It calls modifyProps', function () {
            var col = __assign({}, generatedColumn);
            var modifyPropsSpy = sandbox.spy(function (col) { return col; });
            col.modifyProps = modifyPropsSpy;
            MUITableUtils_1["default"].buildGeneratedColumns([col], data);
            expect(modifyPropsSpy.callCount).toBe(1);
        });
        test('It calls generateRelatedColumns', function () {
            var col = __assign({}, generatedColumn);
            var genRelated = sandbox.spy(function (col) { return []; });
            col.generateRelatedColumns = genRelated;
            MUITableUtils_1["default"].buildGeneratedColumns([col], data);
            expect(genRelated.callCount).toBe(1);
        });
        test('It returns the cols from generateRelatedColumns', function () {
            var col = __assign({}, generatedColumn);
            col.generateRelatedColumns = function () { return [constants_1.DEFAULT_COL]; };
            var result = MUITableUtils_1["default"].buildGeneratedColumns([col], data);
            expect(result.length).toBe(2);
        });
        test('It handles modifyProps errors', function () {
            var col = __assign({}, generatedColumn);
            var modifyPropsSpy = sandbox.spy(function (col) {
                throw new Error('test');
            });
            col.modifyProps = modifyPropsSpy;
            var test = function () { return MUITableUtils_1["default"].buildGeneratedColumns([col], data); };
            expect(test).not.toThrow();
        });
        test('It handles generateRelatedColumns errors', function () {
            var col = __assign({}, generatedColumn);
            var genRelated = sandbox.spy(function (col) {
                throw new Error('test');
            });
            col.generateRelatedColumns = genRelated;
            var test = function () { return MUITableUtils_1["default"].buildGeneratedColumns([col], data); };
            expect(test).not.toThrow();
        });
    });
    describe("MUITableUtils.filterDuplicates", function () {
        test('It returns the correct amount of rows', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var result = MUITableUtils_1["default"].buildRows(data, [constants_1.DEFAULT_COL, col], __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { skipDuplicates: true }) }));
            expect(result).toHaveLength(1);
        });
    });
    describe("MUITableUtils.mergeDuplicates", function () {
        test('It sums the row values', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var result = MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { mergeDuplicates: true, skipDuplicates: false }) }));
            expect(result).toHaveLength(1);
            expect(result[0][0].value).toBe(2);
        });
        test('It handles mergeFunction errors', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var mergeFunction = function () {
                throw new Error('test');
            };
            var test = function () {
                return MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { mergeFunction: mergeFunction, mergeDuplicates: true, skipDuplicates: false }) }));
            };
            expect(test).not.toThrow();
            var result = test();
            expect(result[0][0].value).toBe(2);
        });
    });
    describe("MUITableUtils.mergeForHiddenColumns", function () {
        test('returns rows if !hiddenColumnMerge', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var rows = MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], constants_1.DEFAULT_OPTS);
            var result = MUITableUtils_1["default"].mergeForHiddenColumns(rows, constants_1.DEFAULT_OPTS, [true, false]);
            expect(result).toHaveLength(rows.length);
        });
        test('returns rows if no columns hidden', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { hiddenColumnMerge: true }) });
            var rows = MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], opts);
            var result = MUITableUtils_1["default"].mergeForHiddenColumns(rows, opts, [true, true]);
            expect(result).toHaveLength(rows.length);
        });
        test('It sums the row values', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var opts = __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { hiddenColumnMerge: true, skipDuplicates: false }) });
            var rows = MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], opts);
            var result = MUITableUtils_1["default"].mergeForHiddenColumns(rows, opts, [true, false]);
            expect(result).toHaveLength(1);
            expect(result[0][0].value).toBe(2);
        });
    });
    describe("MUITableUtils.mergeCellsCalc", function () {
        test('it doesnt change dimensions', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var rows = MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], constants_1.DEFAULT_OPTS);
            var result = MUITableUtils_1["default"].mergeCellsCalc(rows);
            expect(result[1].display).toBe('');
        });
        test('it sums metrics', function () {
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var rows = MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], constants_1.DEFAULT_OPTS);
            var result = MUITableUtils_1["default"].mergeCellsCalc(rows);
            expect(result[0].value).toBe(2);
        });
        test('uses the columns summaryFormat', function () {
            var stub = sandbox.stub(MUITableUtils_1["default"], 'formatValue');
            var col = __assign({}, constants_1.DEFAULT_COL, { name: 'test', type: 'metric', isRowId: false, summaryOptions: {
                    type: 'AVG',
                    format: 'seconds'
                }, calculateCellDefinition: function (e) { return ({ display: '1', value: 1 }); } });
            var data = [{ value: 1 }, { value: 1 }];
            var rows = MUITableUtils_1["default"].buildRows(data, [col, constants_1.DEFAULT_COL], constants_1.DEFAULT_OPTS);
            var result = MUITableUtils_1["default"].mergeCellsCalc(rows);
            expect(result[0].value).toBe(2);
            expect(stub.args[0][1]).toBe('seconds');
        });
    });
});
