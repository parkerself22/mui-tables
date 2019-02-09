import MUITableUtils from "../src/MUITableUtils";
import {
    DEFAULT_COL,
    DEFAULT_OPTS,
    GeneratedColumn,
    PropColumn,
    StateColumn,
    SummaryRowCell
} from "../src/types/index";
import sinon from "sinon";
const sandbox = sinon.createSandbox();

describe("MUITableUtils", () => {
    afterEach(() => {
        sandbox.restore();
    });
    describe(`MUITableUtils.formatSeconds`, () => {
        const timeTests = [
            [0, "0:00"], // 0
            [59, "0:00"], // < 1 min
            [60, "0:01"], //  1 min
            [3599, "0:59"], // < 1 hour
            [3600, "1:00"], // 1 hour
            [3661, "1:01"], // 1 hour, 1 minute
            [35959, "9:59"], // < 10 hours
            [36000, "10:00"], // 10 hours
            [36060, "10:01"] // 10 hours 1 minute
        ];
        it.each(timeTests)(`formats %i seconds into %s`, (secs, text) => {
            const result = MUITableUtils.formatSeconds(secs);
            expect(result).toBe(text);
        });
    });
    describe(`MUITableUtils.formatValue`, () => {
        const tests = [
            [2.25, "float", "2.25"],
            [2.25, "integer", "2"],
            [60, "seconds", "0:01"],
            [60, "minutes", "1:00"],
            [5, "hours", "5:00"]
        ];
        test.each(tests)(`formats %i %s into %s`, (val, format, expected) => {
            const result = MUITableUtils.formatValue(val, format);
            expect(result).toBe(expected);
        });
    });
    describe(`MUITableUtils.formatColumnValue`, () => {
        const tests = [
            [
                2.25,
                "Postfix",
                "2.25 Postfix",
                {
                    name: "test",
                    summaryOptions: {
                        postfix: " Postfix"
                    }
                }
            ],
            [
                2.25,
                "Prefix",
                "Prefix 2.25",
                {
                    name: "test",
                    summaryOptions: {
                        prefix: "Prefix "
                    }
                }
            ],
            [
                2.25,
                "Prefix & Postfix",
                "Prefix 2.25 Postfix",
                {
                    name: "test",
                    summaryOptions: {
                        prefix: "Prefix ",
                        postfix: " Postfix"
                    }
                }
            ]
        ];
        test.each(tests)(`formats %i with %s into "%s"`, (val, title, expected, col) => {
            const result = MUITableUtils.formatColumnValue(val, col);
            expect(result).toBe(expected);
        });
    });
    describe(`MUITableUtils.sumColumnCell`, () => {
        const tests = [
            // value, case, cell, expected
            [1, "cell with value", { value: 1 }, 2],
            [1, "cell without value", {}, 1],
            [1, "NaN cell", { value: NaN }, 1],
            [1, "String cell value", { value: "1" }, 2]
        ];
        test.each(tests)(`sums %i %s into %s`, (val, testCase, cell, expected) => {
            const result = MUITableUtils.sumColumnCell(val, cell);
            expect(result).toBe(expected);
        });
    });
    describe(`MUITableUtils.validateCustomSummaryCell`, () => {
        test("throws when not an object", () => {
            expect(() => {
                MUITableUtils.validateCustomSummaryCell("" as any);
            }).toThrow();
        });
        test("throws when missing top level props", () => {
            const missingProps = {
                total: {}
            };
            expect(() => {
                MUITableUtils.validateCustomSummaryCell(missingProps as any);
            }).toThrow();
        });
        test("throws when missing nested props", () => {
            const missingProps = {
                total: {},
                visible: {
                    value: 1
                }
            };
            expect(() => {
                MUITableUtils.validateCustomSummaryCell(missingProps as any);
            }).toThrow();
        });
    });
    describe(`MUITableUtils.calculateSummaryRow`, () => {
        const displayRows = [[{ value: 1, display: "1", column: {} as any }]];
        const allRows = [...displayRows];
        test("console.errors for custom calculate columns errors", () => {
            const calcResult = "";
            const calcSpy = sandbox.spy((displayRows: any, allRows: any) => calcResult);
            const cols: StateColumn<any>[] = [
                {
                    ...DEFAULT_COL,
                    name: "test",
                    type: "metric",
                    summary: true,
                    calculateCellDefinition: entry => ({ value: 1, display: "1" }),
                    summaryOptions: {
                        type: "SUM",
                        format: "integer",
                        customCalculate: calcSpy
                    }
                }
            ];
            const consoleSpy = sandbox.stub(console, "error");
            MUITableUtils.calculateSummaryRow(displayRows, allRows, cols);
            expect(consoleSpy.callCount).toBe(3);
            consoleSpy.restore();
        });
        test("uses custom calculate columns", () => {
            const calcResult: SummaryRowCell = {
                total: { value: 1, display: "1", column: {} as any },
                visible: { value: 1, display: "1", column: {} as any }
            };
            const calcSpy = sandbox.spy((displayRows: any, allRows: any) => calcResult);
            const cols: StateColumn<any>[] = [
                {
                    ...DEFAULT_COL,
                    name: "test",
                    type: "metric",
                    summary: true,
                    calculateCellDefinition: entry => ({ value: 1, display: "1" }),
                    summaryOptions: {
                        type: "SUM",
                        format: "integer",
                        customCalculate: calcSpy
                    }
                }
            ];
            const result = MUITableUtils.calculateSummaryRow(displayRows, allRows, cols);
            expect(calcSpy.callCount).toBe(1);
            expect(result[0]).toMatchObject(calcResult);
        });
        test("returns null cell for summary: false column", () => {
            const cols: StateColumn<any>[] = [
                {
                    ...DEFAULT_COL,
                    name: "test",
                    type: "metric",
                    summary: false
                }
            ];
            const result = MUITableUtils.calculateSummaryRow(displayRows, allRows, cols);
            result.forEach(r => {
                expect(r.visible.value).toBe(null);
                expect(r.total.value).toBe(null);
                expect(r.visible.display).toBe("");
                expect(r.total.display).toBe("");
            });
        });
        test("returns null cell for type: dimension column", () => {
            const cols: StateColumn<any>[] = [
                {
                    ...DEFAULT_COL,
                    name: "test",
                    type: "dimension",
                    summary: true
                }
            ];
            const result = MUITableUtils.calculateSummaryRow(displayRows, allRows, cols);
            result.forEach(r => {
                expect(r.visible.value).toBe(null);
                expect(r.total.value).toBe(null);
                expect(r.visible.display).toBe("");
                expect(r.total.display).toBe("");
            });
        });
        test("SUMS rows by default", () => {
            const cols: StateColumn<any>[] = [
                {
                    ...DEFAULT_COL,
                    name: "test",
                    type: "metric",
                    summary: true,
                    calculateCellDefinition: entry => ({ display: "1", value: 1 })
                }
            ];
            const result = MUITableUtils.calculateSummaryRow(displayRows, allRows, cols);
            result.forEach(r => {
                expect(r.visible.value).toBe(1);
                expect(r.total.value).toBe(1);
                expect(r.visible.display).toBe("1.00");
                expect(r.total.display).toBe("1.00");
            });
        });
        test("AVGs rows correctly", () => {
            const cols: StateColumn<any>[] = [
                {
                    ...DEFAULT_COL,
                    name: "test",
                    type: "metric",
                    summary: true,
                    summaryOptions: {
                        format: "float",
                        type: "AVG"
                    },
                    calculateCellDefinition: entry => ({ display: "1.00", value: 1 })
                }
            ];
            const newRows = [...displayRows];
            const result = MUITableUtils.calculateSummaryRow(newRows, newRows, cols);
            result.forEach(r => {
                expect(r.visible.value).toBe(1);
                expect(r.total.value).toBe(1);
                expect(r.visible.display).toBe("1.00");
                expect(r.total.display).toBe("1.00");
            });
        });
    });
    describe(`MUITableUtils.sortRows`, () => {
        const col = { ...DEFAULT_COL, name: "test", type: "metric" as "metric" };
        const rows = [
            [{ value: 1, display: "1", column: col }],
            [{ value: 2, display: "2", column: col }]
        ];
        const state = {
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
        test("Returns rows in same order when sort index is null", () => {
            const testState = { ...state };
            const result = MUITableUtils.sortRows(rows, testState, [col]);
            expect(result[0][0].value).toBe(1);
            expect(result[1][0].value).toBe(2);
        });
        test("Returns rows in correct order when sort.asc is true", () => {
            const testState = { ...state, sortColumn: { index: 0, asc: true } };
            const result = MUITableUtils.sortRows(rows, testState, [col]);
            expect(result[0][0].value).toBe(1);
            expect(result[1][0].value).toBe(2);
        });
        test("Returns rows in correct order when sort.asc is false", () => {
            const testState = { ...state, sortColumn: { index: 0, asc: false } };
            const result = MUITableUtils.sortRows(rows, testState, [col]);
            expect(result[0][0].value).toBe(2);
            expect(result[1][0].value).toBe(1);
        });
    });
    describe(`MUITableUtils.filterRows`, () => {
        const col = { ...DEFAULT_COL, name: "test", type: "metric" as "metric" };
        const rows = [
            [{ value: 1, display: "1", column: col }],
            [{ value: 2, display: "2", column: col }]
        ];
        const state = {
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
        test("It doesn't filter when opts.display.filter = false", () => {
            const testRows = [...rows];
            const opts = {
                ...DEFAULT_OPTS,
                display: { ...DEFAULT_OPTS.display, filter: false }
            };
            const spy = sandbox.stub(testRows, "reduce");
            MUITableUtils.filterRows(rows, state, opts, [col]);
            expect(spy.callCount).toBe(0);
        });
        test("It handles rows that dont have cells for all columns", () => {
            const testRows = [rows[0], [{}], [null]];
            const opts = {
                ...DEFAULT_OPTS,
                display: { ...DEFAULT_OPTS.display, filter: true }
            };
            const testState = {
                ...state,
                columnFilters: [["12"]]
            };
            const tester = () => MUITableUtils.filterRows(testRows as any, testState, opts, [col]);
            expect(tester).not.toThrow();
        });
        test("It handles columns with no active filters", () => {
            const testRows = [
                [{ value: 1, display: "1", column: col },
                { value: 2, display: "2", column: col }]];
            const opts = {
                ...DEFAULT_OPTS,
                display: { ...DEFAULT_OPTS.display, filter: true }
            };
            const testState = {
                ...state,
                columnFilters: [["12"], []]
            };
            const tester = () => MUITableUtils.filterRows(testRows as any, testState, opts, [col]);
            expect(tester).not.toThrow();
        });
        test("It filters when opts.display.filter = true", () => {
            const testRows = [...rows];
            const opts = {
                ...DEFAULT_OPTS,
                display: { ...DEFAULT_OPTS.display, filter: true }
            };
            const testState = { ...state, columnFilters: [["1"]] };
            const spy = sandbox.stub(Array.prototype, "reduce");
            MUITableUtils.filterRows(rows, testState, opts, [col]);
            expect(spy.callCount).toBe(1);
            sandbox.restore();
        });
        test("It only includes exact matches when filterOptions.exact = true", () => {
            const testRows = [...rows, [{ value: 12, display: "12", column: col }]];
            const testCol = {
                ...col,
                filterOptions: {
                    exact: true,
                    type: "multiselect" as "multiselect",
                    currentList: []
                }
            };
            const opts = {
                ...DEFAULT_OPTS,
                display: { ...DEFAULT_OPTS.display, filter: true }
            };
            const testState = { ...state, columnFilters: [["12"]] };
            const result = MUITableUtils.filterRows(testRows, testState, opts, [testCol]);
            expect(result[0][0].display).toBe("12");
        });
        test("It includes 'contains' matches when filterOptions.exact = false", () => {
            const testRows = [...rows, [{ value: 12, display: "12", column: col }]];
            const testCol = {
                ...col,
                filterOptions: {
                    exact: false,
                    type: "multiselect" as "multiselect",
                    currentList: []
                }
            };
            const opts = {
                ...DEFAULT_OPTS,
                display: { ...DEFAULT_OPTS.display, filter: true }
            };
            const testState = { ...state, columnFilters: [["1"]] };
            const result = MUITableUtils.filterRows(testRows, testState, opts, [testCol]);
            expect(result.length).toBe(2);
        });
    });
    describe(`MUITableUtils.searchFilterOk`, () => {
        const col = { ...DEFAULT_COL, name: "test", type: "metric" as "metric" };
        const state = {
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
        test("It returns ok = true when search not open", () => {
            const testRow = [{ value: 1, display: "1", column: col }];
            const testState = {
                ...state,
                ...{
                    search: {
                        text: " ",
                        open: false
                    }
                }
            };
            const result = MUITableUtils.searchFilterOk(testRow, testState);
            expect(result).toBe(true);
        });
        test("It returns ok = true when search text is null", () => {
            const testRow = [{ value: 1, display: "1", column: col }];
            const testState = {
                ...state,
                ...{
                    search: {
                        text: null,
                        open: true
                    }
                }
            };
            const result = MUITableUtils.searchFilterOk(testRow, testState);
            expect(result).toBe(true);
        });
        test("It returns ok = false when search text not in row", () => {
            const testRow = [{ value: 1, display: "1", column: col }];
            const testState = {
                ...state,
                ...{
                    search: {
                        text: "2",
                        open: true
                    }
                }
            };
            const result = MUITableUtils.searchFilterOk(testRow, testState);
            expect(result).toBe(false);
        });
        test("It returns ok = true when search text in the row", () => {
            const testRow = [{ value: 1, display: "1", column: col }];
            const testState = {
                ...state,
                ...{
                    search: {
                        text: "1",
                        open: true
                    }
                }
            };
            const result = MUITableUtils.searchFilterOk(testRow, testState);
            expect(result).toBe(true);
        });
    });
    describe(`MUITableUtils.findRowIndexById`, () => {
        test("It finds row if its id exists in list", () => {
            const col = { ...DEFAULT_COL, name: "test", type: "metric" as "metric", isRowId: true };
            const row = [{ value: 1, display: "1", column: col }];
            const rowId = MUITableUtils.rowId(row);
            const list = [rowId];
            expect(MUITableUtils.findRowIndexById(row, list)).toBe(0);
        });
        test("It doesn't find row if when id not in list", () => {
            const col = { ...DEFAULT_COL, name: "test", type: "metric" as "metric", isRowId: true };
            const row = [{ value: 1, display: "1", column: col }];
            const rowId = MUITableUtils.rowId(row);
            const list: string[] = [];
            expect(MUITableUtils.findRowIndexById(row, list)).toBe(-1);
        });
    });
    describe(`MUITableUtils.rowId`, () => {
        test("It generates random when no isRowId columns passed", () => {
            const col = {
                ...DEFAULT_COL,
                name: "test",
                type: "metric" as "metric",
                isRowId: false
            };
            const row = [{ value: 1, display: "1", column: col }];
            expect(() => MUITableUtils.rowId(row)).not.toThrow();
            expect(MUITableUtils.rowId(row)).not.toBe("1");
        });
        test("It joins row props to generate id when isRowId = true", () => {
            const col = { ...DEFAULT_COL, name: "test", type: "metric" as "metric", isRowId: true };
            const row = [{ value: 1, display: "1", column: col }];
            const exp = "1";
            expect(MUITableUtils.rowId(row)).toBe(exp);
        });
    });
    describe(`MUITableUtils.buildRows`, () => {
        test("It calls calculateCellDefinition", () => {
            const spy = sandbox.spy((e: any) => ({ display: "1", value: 1 }));
            const col = {
                ...DEFAULT_COL,
                name: "test",
                type: "metric" as "metric",
                isRowId: false,
                calculateCellDefinition: spy
            };
            const data = [{ value: 1 }];
            const result = MUITableUtils.buildRows(data, [col]);
            expect(spy.callCount).toBe(1);
        });
    });
    describe(`MUITableUtils.buildOptions`, () => {
        test("It doesn't throw", () => {
            const data = [{ value: 1 }];
            const props = {
                data,
                title: "t",
                loading: false,
                columns: {
                    static: [],
                    generated: []
                }
            };
            expect(() => MUITableUtils.buildOptions(props)).not.toThrow();
        });
    });
    describe(`MUITableUtils.buildStaticColumns`, () => {
        test("It doesn't throw", () => {
            const data = [{ value: 1 }];

            expect(() => MUITableUtils.buildStaticColumns(data, [])).not.toThrow();
        });
    });
    describe(`MUITableUtils.buildGeneratedColumns`, () => {
        const data = [
            {
                value: 1,
                obj: {
                    entry: {
                        name: "Generated Column",
                        value: "test"
                    }
                }
            }
        ];
        const generatedColumn: GeneratedColumn<any> = {
            path: ["obj", "entry"],
            nameProp: "name",
            type: "dimension",
            options: {
                calculateCellDefinition: entry => ({ display: entry.value, value: entry })
            }
        };
        test("It returns the correct column", () => {
            const result = MUITableUtils.buildGeneratedColumns([generatedColumn], data);
            expect(result[0].title).toBe("Generated Column");
        });
        test("It handles inaccessible propsPath", () => {
            const col = { ...generatedColumn, path: ["doesnt", "exist"] };
            const test = () => MUITableUtils.buildGeneratedColumns([col], data);
            expect(test).not.toThrow();
            const result = test();
            expect(result.length).toBe(0);
        });
        test("It calls modifyProps", () => {
            const col = { ...generatedColumn };
            const modifyPropsSpy = sandbox.spy((col: any) => col);
            col.modifyProps = modifyPropsSpy;
            MUITableUtils.buildGeneratedColumns([col], data);
            expect(modifyPropsSpy.callCount).toBe(1);
        });
        test("It calls generateRelatedColumns", () => {
            const col = { ...generatedColumn };
            const genRelated = sandbox.spy((col: any) => []);
            col.generateRelatedColumns = genRelated;
            MUITableUtils.buildGeneratedColumns([col], data);
            expect(genRelated.callCount).toBe(1);
        });
        test("It returns the cols from generateRelatedColumns", () => {
            const col = { ...generatedColumn };
            col.generateRelatedColumns = () => [DEFAULT_COL];
            const result = MUITableUtils.buildGeneratedColumns([col], data);
            expect(result.length).toBe(2);
        });
        test("It handles modifyProps errors", () => {
            const col = { ...generatedColumn };
            const modifyPropsSpy = sandbox.spy((col: any) => {
                throw new Error("test");
            });
            col.modifyProps = modifyPropsSpy;
            const test = () => MUITableUtils.buildGeneratedColumns([col], data);
            expect(test).not.toThrow();
        });
        test("It handles generateRelatedColumns errors", () => {
            const col = { ...generatedColumn };
            const genRelated = sandbox.spy((col: any) => {
                throw new Error("test");
            });
            col.generateRelatedColumns = genRelated;
            const test = () => MUITableUtils.buildGeneratedColumns([col], data);
            expect(test).not.toThrow();
        });
    });
});
