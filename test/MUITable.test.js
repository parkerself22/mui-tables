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
var react_1 = require("react");
var shallow_1 = require("react-test-renderer/shallow");
var react_testing_library_1 = require("react-testing-library");
var sinon_1 = require("sinon");
var MUITable_1 = require("../src/components/MUITable");
var MUITableWrapper_1 = require("../src/components/MUITableWrapper");
var constants_1 = require("../src/constants");
var MUITableUtils_1 = require("../src/constants/MUITableUtils");
var utils_1 = require("./utils");
var sandbox = sinon_1["default"].createSandbox();
afterEach(react_testing_library_1.cleanup);
afterAll(sandbox.restore);
function tableInstance(props) {
    var ChildTable = MUITable_1.MUITable(__assign({ data: utils_1.EXAMPLE_INPUT_DATA, columns: { static: utils_1.EXAMPLE_COLUMNS }, title: 'Test', loading: false }, props));
    var renderer = shallow_1["default"].createRenderer();
    renderer.render(ChildTable);
    var instance = renderer.getMountedInstance();
    return instance;
}
describe('MUITableParent', function () {
    test('default export renders', function () {
        var test = function () {
            return react_testing_library_1.render(<MUITable_1["default"] data={utils_1.EXAMPLE_INPUT_DATA} columns={{ static: utils_1.EXAMPLE_COLUMNS }} title={'test'} loading={false}/>);
        };
        expect(test).not.toThrow();
    });
    test('calls sortColumns if provided', function () {
        var sortColumns = sandbox.spy(function (c) { return c; });
        MUITable_1.MUITable({
            data: utils_1.EXAMPLE_INPUT_DATA,
            columns: { sortColumns: sortColumns, static: utils_1.EXAMPLE_COLUMNS },
            title: 'Test',
            loading: false
        });
        expect(sortColumns.called).toBe(true);
    });
    test('handles sortColumns throwing errors', function () {
        var sortColumns = sandbox.spy(function (c) {
            throw new Error('test');
        });
        var test = function () {
            return MUITable_1.MUITable({
                data: utils_1.EXAMPLE_INPUT_DATA,
                columns: { sortColumns: sortColumns, static: utils_1.EXAMPLE_COLUMNS },
                title: 'Test',
                loading: false
            });
        };
        expect(test).not.toThrow();
    });
    test('renders without crashing', function () {
        var test = function () {
            return react_testing_library_1.render(<MUITable_1.MUITable data={utils_1.EXAMPLE_INPUT_DATA} columns={{ static: utils_1.EXAMPLE_COLUMNS }} title={'test'} loading={false}/>);
        };
        expect(test).not.toThrow();
    });
});
describe('MUITableChild', function () {
    describe('constructor', function () {
        test('uses initial paginate options', function () {
            var instance = tableInstance({
                pagination: __assign({}, constants_1.DEFAULT_OPTS.pagination, { page: 2 })
            });
            expect(instance.state.pagination.page).toBe(2);
        });
        test('uses default rowsPerPage & rowsPerPageOptions', function () {
            var instance = tableInstance({
                pagination: __assign({}, constants_1.DEFAULT_OPTS.pagination, { rowsPerPage: undefined, rowsPerPageOptions: undefined })
            });
            expect(instance.state.pagination.rowsPerPage).toBe(5);
            expect(instance.state.pagination.rowsPerPageOptions).toEqual([5, 10, 15]);
        });
        test('adds the initial rowsPerPage to rowsPerPageOptions if not found', function () {
            var instance = tableInstance({
                pagination: __assign({}, constants_1.DEFAULT_OPTS.pagination, { rowsPerPage: 69, rowsPerPageOptions: [5, 10, 15] })
            });
            expect(instance.state.pagination.rowsPerPage).toBe(69);
            expect(instance.state.pagination.rowsPerPageOptions).toEqual([5, 10, 15, 69]);
        });
    });
    test('sortedFilteredRows', function () {
        var instance = tableInstance();
        var result = instance.sortedFilteredRows();
        expect(result).toHaveProperty('displayRows');
        expect(result).toHaveProperty('rows');
    });
    describe('getVisibleColumns', function () {
        test('returns empty array when all filtered', function () {
            var instance = tableInstance();
            var viewColumns = instance.props.columns.map(function (c) { return false; });
            instance.state = __assign({}, instance.state, { viewColumns: viewColumns });
            var result = instance.getVisibleColumns();
            expect(result).toHaveProperty('length');
            expect(result.length).toBe(0);
        });
        test('returns all when no active filters', function () {
            var instance = tableInstance();
            var viewColumns = instance.props.columns.map(function (c) { return true; });
            instance.state = __assign({}, instance.state, { viewColumns: viewColumns });
            var result = instance.getVisibleColumns();
            expect(result).toHaveProperty('length');
            expect(result.length).toBe(instance.props.columns.length);
        });
    });
    describe('toggleViewColumn', function () {
        test('toggles the columns', function () {
            var instance = tableInstance();
            instance.toggleViewColumn(0);
            expect(instance.state.viewColumns[0]).toBe(false);
        });
        test('handles columns out of index', function () {
            var instance = tableInstance();
            instance.toggleViewColumn(69);
            expect(instance.state.viewColumns[69]).toBeUndefined();
        });
        test('calls onColumnViewChange hook', function () {
            var onColumnViewChange = sandbox.spy();
            var instance = tableInstance({
                hooks: {
                    onColumnViewChange: onColumnViewChange
                }
            });
            instance.toggleViewColumn(0);
            expect(onColumnViewChange.called).toBe(true);
            expect(onColumnViewChange.calledOnceWith(instance.props.columns[0], false)).toBe(true);
        });
    });
    test('searchTextUpdate', function () {
        var instance = tableInstance();
        var searchText = 'test';
        instance.searchTextUpdate(searchText);
        expect(instance.state.search.text).toBe(searchText);
    });
    describe('toggleSearchVisible', function () {
        test('sets Text to null if opened -> closed', function () {
            var instance = tableInstance();
            instance.state = __assign({}, instance.state, { search: {
                    text: 'test',
                    open: true
                } });
            instance.toggleSearchVisible();
            expect(instance.state.search.text).toBe(null);
            expect(instance.state.search.open).toBe(false);
        });
        test('sets open: true closed -> opened', function () {
            var instance = tableInstance();
            instance.setState({
                search: {
                    text: 'test',
                    open: false
                }
            });
            instance.render();
            instance.toggleSearchVisible();
            expect(instance.state.search.text).toBe('test');
            expect(instance.state.search.open).toBe(true);
        });
    });
    describe('onFilterUpdate', function () {
        test('handles columns out of index', function () {
            var instance = tableInstance();
            instance.onFilterUpdate(69, 'test');
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test('sets colIndex val to array if array provided', function () {
            var instance = tableInstance();
            var value = ['t'];
            instance.onFilterUpdate(0, value);
            expect(instance.state.columnFilters[0][0]).toBe(value[0]);
        });
        test('sets 0 length if null string passed', function () {
            var instance = tableInstance();
            instance.onFilterUpdate(0, '');
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test('removes value if single existing value passed', function () {
            var instance = tableInstance();
            var value = ['t'];
            instance.state.columnFilters[0] = value;
            instance.onFilterUpdate(0, value[0]);
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test('sets new array if single non-existing value passed', function () {
            var instance = tableInstance();
            var string = 't';
            instance.onFilterUpdate(0, string);
            expect(instance.state.columnFilters[0][0]).toBe(string);
        });
        test('calls onFilterChange hook', function () {
            var onFilterChange = sandbox.spy();
            var instance = tableInstance({
                hooks: {
                    onFilterChange: onFilterChange
                }
            });
            var string = 't';
            instance.onFilterUpdate(0, string);
            expect(onFilterChange.called).toBe(true);
            expect(onFilterChange.calledOnceWith(string, instance.state.columnFilters)).toBe(true);
        });
    });
    describe('onFilterReset', function () {
        test('onFilterReset', function () {
            var instance = tableInstance();
            instance.onFilterReset();
            for (var _i = 0, _a = instance.state.columnFilters; _i < _a.length; _i++) {
                var col = _a[_i];
                expect(col.length).toBe(0);
            }
        });
        test('calls onFilterChange hook', function () {
            var onFilterChange = sandbox.spy();
            var instance = tableInstance({
                hooks: {
                    onFilterChange: onFilterChange
                }
            });
            instance.onFilterReset();
            expect(onFilterChange.called).toBe(true);
            expect(onFilterChange.calledOnceWith([], instance.state.columnFilters)).toBe(true);
        });
    });
    describe('onRowsDelete', function () {
        test('calls hooks.onRowsDelete', function () {
            var onRowsDelete = sandbox.spy();
            var instance = tableInstance(__assign({}, constants_1.DEFAULT_OPTS, { hooks: __assign({}, constants_1.DEFAULT_OPTS.hooks, { onRowsDelete: onRowsDelete }) }));
            instance.onRowsDelete();
            expect(onRowsDelete.called).toBe(true);
        });
        test('handles hooks.onRowsDelete errors', function () {
            var onRowsDelete = sandbox.spy(function () {
                throw new Error('test');
            });
            var instance = tableInstance(__assign({}, constants_1.DEFAULT_OPTS, { hooks: __assign({}, constants_1.DEFAULT_OPTS.hooks, { onRowsDelete: onRowsDelete }) }));
            var test = function () { return instance.onRowsDelete(); };
            expect(test).not.toThrow();
            expect(onRowsDelete.called).toBe(true);
        });
        test('works without hooks.onRowsDelete', function () {
            var onRowsDelete = sandbox.spy(function () {
                throw new Error('test');
            });
            var instance = tableInstance(__assign({}, constants_1.DEFAULT_OPTS));
            var test = function () { return instance.onRowsDelete(); };
            expect(test).not.toThrow();
            expect(onRowsDelete.called).toBe(false);
        });
    });
    describe('toggleRowSelected', function () {
        test('adds row if not selected', function () {
            var instance = tableInstance();
            var testRow = instance.props.rows[0];
            var testRowId = MUITableUtils_1["default"].rowId(testRow);
            instance.toggleRowSelected(testRow);
            expect(instance.state.selectedRows.indexOf(testRowId)).toBeGreaterThanOrEqual(0);
        });
        test('removes row if already selected', function () {
            var instance = tableInstance();
            var testRow = instance.props.rows[0];
            var testRowId = MUITableUtils_1["default"].rowId(testRow);
            instance.toggleRowSelected(testRow);
            instance.toggleRowSelected(testRow);
            expect(instance.state.selectedRows.indexOf(testRowId)).toBeLessThan(0);
        });
        test('calls onRowsSelect hook', function () {
            var onRowsSelect = sandbox.spy();
            var instance = tableInstance({
                hooks: {
                    onRowsSelect: onRowsSelect
                }
            });
            var testRow = instance.props.rows[0];
            instance.toggleRowSelected(testRow);
            expect(onRowsSelect.called).toBe(true);
            expect(onRowsSelect.args[0]).toHaveLength(3);
            instance.toggleRowSelected(testRow);
            expect(onRowsSelect.args[1]).toHaveLength(3);
        });
    });
    describe('getFilterData', function () {
        test('it returns values', function () {
            var instance = tableInstance();
            var result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBeGreaterThan(0);
        });
        test('it filters repeat values', function () {
            var instance = tableInstance({
                data: utils_1.EXAMPLE_INPUT_DATA.concat([
                    utils_1.EXAMPLE_INPUT_DATA[0]
                ])
            });
            var result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBeGreaterThan(0);
        });
        test('it returns empty array if non-existent column passed', function () {
            var instance = tableInstance();
            var columnProp = __assign({}, constants_1.DEFAULT_COL, { name: 'TEST 123456', title: 'TEST 123456', type: 'dimension' });
            var result = instance.getFilterData(columnProp);
            expect(result.length).toBe(0);
        });
        test('it returns empty array if no rows', function () {
            var instance = tableInstance({
                data: []
            });
            var result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBe(0);
        });
        test('it handles rows not fitting column index', function () {
            var instance = tableInstance({
                columns: { static: utils_1.EXAMPLE_COLUMNS.slice(0, 1) }
            });
            var initial = instance.getFilterData(instance.props.columns[0]);
            instance.props.rows[0] = [];
            var result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBe(initial.length - 1);
        });
        test('it includes column.filterOptions.defaultOpts', function () {
            var instance = tableInstance({
                data: []
            });
            var defaultOpt = 'TEST 123456';
            instance.props.columns[0].filterOptions = {
                exact: false,
                type: 'checkbox',
                defaultOpts: [defaultOpt]
            };
            var result = instance.getFilterData(instance.props.columns[0]);
            expect(result[0]).toBe(defaultOpt);
        });
    });
    test('changePage', function () {
        var instance = tableInstance();
        var paginationState = __assign({}, instance.state.pagination, { page: 2 });
        instance.changePage(2);
        expect(instance.state.pagination).toMatchObject(paginationState);
    });
    describe('toggleSort', function () {
        test('it goes asc -> desc -> off', function () {
            var instance = tableInstance();
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: 1, asc: true });
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: 1, asc: false });
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: null, asc: true });
        });
        test('it calls onColumnSortChange hook', function () {
            var onColumnSortChange = sandbox.spy();
            var instance = tableInstance({
                hooks: {
                    onColumnSortChange: onColumnSortChange
                }
            });
            instance.toggleSort(1);
            expect(onColumnSortChange.called).toBe(true);
            expect(onColumnSortChange.calledOnceWith(instance.props.columns[1], "asc")).toBe(true);
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: 1, asc: false });
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: null, asc: true });
        });
    });
    test('changeRowsPerPage', function () {
        var instance = tableInstance();
        var paginationState = __assign({}, instance.state.pagination, { rowsPerPage: 2 });
        instance.changeRowsPerPage(2);
        expect(instance.state.pagination).toMatchObject(paginationState);
    });
    describe('handleAllSelect', function () {
        test('it sets selectedRows to [] if all selected already', function () {
            var instance = tableInstance();
            var selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(function (r) { return MUITableUtils_1["default"].rowId(r); });
            instance.setState({ selectedRows: selectedRows });
            instance.handleAllSelect();
            expect(instance.state.selectedRows.length).toBe(0);
        });
        test('it sets selectedRows to ALL if selectedRows.length < displayRows.length', function () {
            var instance = tableInstance();
            var selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(function (r) { return MUITableUtils_1["default"].rowId(r); });
            instance.setState({ selectedRows: ['ttest'] });
            instance.handleAllSelect();
            expect(instance.state.selectedRows.length).toBe(selectedRows.length);
        });
        test('it calls onRowsSelect hook with correct args', function () {
            var onRowsSelect = sandbox.spy();
            var instance = tableInstance({
                hooks: {
                    onRowsSelect: onRowsSelect
                }
            });
            var selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(function (r) { return MUITableUtils_1["default"].rowId(r); });
            // select all
            instance.handleAllSelect();
            expect(onRowsSelect.called).toBe(true);
            // new, removed, current selections
            expect(onRowsSelect.args[0][0].length).toBe(selectedRows.length);
            expect(onRowsSelect.args[0][1].length).toBe(0);
            expect(onRowsSelect.args[0][2].length).toBe(selectedRows.length);
            // select none
            instance.handleAllSelect();
            // new, removed, current selections
            expect(onRowsSelect.args[1][0].length).toBe(0);
            expect(onRowsSelect.args[1][1].length).toBe(selectedRows.length);
            expect(onRowsSelect.args[1][2].length).toBe(0);
            // select some
            instance.setState({ selectedRows: [selectedRows[0]] });
            instance.handleAllSelect();
            // new, removed, current selections
            expect(onRowsSelect.args[2][0].length).toBe(selectedRows.length - 1);
            expect(onRowsSelect.args[2][1].length).toBe(0);
            expect(onRowsSelect.args[2][2].length).toBe(selectedRows.length);
        });
    });
});
describe('MUITableWrapper', function () {
    test('renders MUITableToolbarSelect when !selectBarTop', function () {
        var _a = react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: ["test"]
        }}>
                <MUITableWrapper_1["default"] loading={false}/>
            </utils_1.MUITableTestContext>), getByTitle = _a.getByTitle, getByText = _a.getByText;
        var testDelButton = function () { return getByTitle("Delete"); };
        var testText = function () { return getByText("1 row(s) selected"); };
        expect(testDelButton).not.toThrow();
        expect(testText).not.toThrow();
    });
    test('renders MUITableToolbarSelect when selectBarTop', function () {
        var _a = react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: ["test"],
            options: __assign({}, constants_1.DEFAULT_OPTS, { rows: __assign({}, constants_1.DEFAULT_OPTS.rows, { selectBarTop: true }) })
        }}>
                <MUITableWrapper_1["default"] loading={false}/>
            </utils_1.MUITableTestContext>), getByTitle = _a.getByTitle, getByText = _a.getByText;
        var testDelButton = function () { return getByTitle("Delete"); };
        var testText = function () { return getByText("1 row(s) selected"); };
        expect(testDelButton).not.toThrow();
        expect(testText).not.toThrow();
    });
    test('renders switched styles for responsive', function () {
        var getByTestId = react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            options: __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { responsive: 'stacked' }) })
        }}>
                <MUITableWrapper_1["default"] loading={false}/>
            </utils_1.MUITableTestContext>).getByTestId;
        var styleDiv = getByTestId('responsive-style-div');
        expect(styleDiv.style.position).toBe("relative");
        expect(styleDiv.style.overflowX).toBe("");
    });
    test('uses options.display.elevation', function () {
        var container = react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            options: __assign({}, constants_1.DEFAULT_OPTS, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { elevation: 3 }) })
        }}>
                <MUITableWrapper_1["default"] loading={false}/>
            </utils_1.MUITableTestContext>).container;
        var styleDiv = container.querySelector('div[class*="MuiPaper-elevation3"]');
        var notFound = container.querySelector('div[class*="MuiPaper-elevation4"]');
        expect(styleDiv).not.toBe(null);
        expect(notFound).toBe(null);
    });
});
