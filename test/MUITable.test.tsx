import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";
import { cleanup, render } from "react-testing-library";
import sinon from "sinon";
import MUITableDefault, { MUIChildTable, MUITable } from "../src/components/MUITable";
import { DEFAULT_COL, DEFAULT_OPTS } from "../src/constants";
import MUITableUtils from "../src/constants/MUITableUtils";
import { Optional, ParentProps, StateColumn } from "../src/types";
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from "./utils";

const sandbox = sinon.createSandbox();

afterEach(cleanup);

function tableInstance(props?: Optional<ParentProps<any>>): MUIChildTable {
    const ChildTable = MUITable({
        data: EXAMPLE_INPUT_DATA,
        columns: { static: EXAMPLE_COLUMNS },
        title: "Test",
        loading: false,
        ...props
    });
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(ChildTable);
    const instance = renderer.getMountedInstance();
    return instance as MUIChildTable;
}

describe("MUITableParent", () => {
    test("default export renders", () => {
        const test = () =>
            render(
                <MUITableDefault
                    data={EXAMPLE_INPUT_DATA}
                    columns={{ static: EXAMPLE_COLUMNS }}
                    title={"test"}
                    loading={false}
                />
            );
        expect(test).not.toThrow();
    });
    test("calls sortColumns if provided", () => {
        const sortColumns = sandbox.spy((c: any) => c);
        MUITable({
            data: EXAMPLE_INPUT_DATA,
            columns: { sortColumns, static: EXAMPLE_COLUMNS },
            title: "Test",
            loading: false
        });
        expect(sortColumns.called).toBe(true);
    });
    test("handles sortColumns throwing errors", () => {
        const sortColumns = sandbox.spy((c: any) => {
            throw new Error("test");
        });
        const test = () =>
            MUITable({
                data: EXAMPLE_INPUT_DATA,
                columns: { sortColumns, static: EXAMPLE_COLUMNS },
                title: "Test",
                loading: false
            });
        expect(test).not.toThrow();
    });
    test("renders without crashing", () => {
        const test = () =>
            render(
                <MUITable
                    data={EXAMPLE_INPUT_DATA}
                    columns={{ static: EXAMPLE_COLUMNS }}
                    title={"test"}
                    loading={false}
                />
            );
        expect(test).not.toThrow();
    });
});
describe("MUITableChild", () => {
    test("sortedFilteredRows", () => {
        const instance = tableInstance();
        const result = instance.sortedFilteredRows();
        expect(result).toHaveProperty("displayRows");
        expect(result).toHaveProperty("rows");
    });
    describe("getVisibleColumns", () => {
        test("returns empty array when all filtered", () => {
            const instance = tableInstance();
            const viewColumns = instance.props.columns.map(c => false);
            instance.state = {
                ...instance.state,
                viewColumns
            };
            const result = instance.getVisibleColumns();
            expect(result).toHaveProperty("length");
            expect(result.length).toBe(0);
        });
        test("returns all when no active filters", () => {
            const instance = tableInstance();
            const viewColumns = instance.props.columns.map(c => true);
            instance.state = {
                ...instance.state,
                viewColumns
            };
            const result = instance.getVisibleColumns();
            expect(result).toHaveProperty("length");
            expect(result.length).toBe(instance.props.columns.length);
        });
    });
    test("toggleViewColumn", () => {
        const instance = tableInstance();
        instance.toggleViewColumn(0);
        expect(instance.state.viewColumns[0]).toBe(false);
    });
    test("searchTextUpdate", () => {
        const instance = tableInstance();
        const searchText = "test";
        instance.searchTextUpdate(searchText);
        expect(instance.state.search.text).toBe(searchText);
    });
    describe("toggleSearchVisible", () => {
        test("sets Text to null if opened -> closed", () => {
            const instance = tableInstance();
            instance.state = {
                ...instance.state,
                search: {
                    text: "test",
                    open: true
                }
            };
            instance.toggleSearchVisible();
            expect(instance.state.search.text).toBe(null);
            expect(instance.state.search.open).toBe(false);
        });
        test("sets open: true closed -> opened", () => {
            const instance = tableInstance();
            instance.setState({
                search: {
                    text: "test",
                    open: false
                }
            });
            instance.render();
            instance.toggleSearchVisible();
            expect(instance.state.search.text).toBe("test");
            expect(instance.state.search.open).toBe(true);
        });
    });
    describe("onFilterUpdate", () => {
        test("sets colIndex val to array if array provided", () => {
            const instance = tableInstance();
            const value = ["t"];
            instance.onFilterUpdate(0, value);
            expect(instance.state.columnFilters[0][0]).toBe(value[0]);
        });
        test("sets 0 length if null string passed", () => {
            const instance = tableInstance();
            instance.onFilterUpdate(0, '');
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test("removes value if single existing value passed", () => {
            const instance = tableInstance();
            const value = ["t"];
            instance.state.columnFilters[0] = value;
            instance.onFilterUpdate(0, value[0]);
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test("sets new array if single non-existing value passed", () => {
            const instance = tableInstance();
            const string = "t";
            instance.onFilterUpdate(0, string);
            expect(instance.state.columnFilters[0][0]).toBe(string);
        });
    });
    test("onFilterReset", () => {
        const instance = tableInstance();
        instance.onFilterReset();
        for (const col of instance.state.columnFilters) {
            expect(col.length).toBe(0);
        }
    });
    describe("onRowsDelete", () => {
        test("calls hooks.onRowsDelete", () => {
            const onRowsDelete = sandbox.spy();
            const instance = tableInstance({
                ...DEFAULT_OPTS,
                hooks: {
                    ...DEFAULT_OPTS.hooks,
                    onRowsDelete
                }
            });
            instance.onRowsDelete();
            expect(onRowsDelete.called).toBe(true);
        });
        test("handles hooks.onRowsDelete errors", () => {
            const onRowsDelete = sandbox.spy(() => {
                throw new Error("test");
            });
            const instance = tableInstance({
                ...DEFAULT_OPTS,
                hooks: {
                    ...DEFAULT_OPTS.hooks,
                    onRowsDelete
                }
            });
            const test = () => instance.onRowsDelete();
            expect(test).not.toThrow();
            expect(onRowsDelete.called).toBe(true);
        });
    });
    describe("toggleRowSelected", () => {
        test("adds row if not selected", () => {
            const instance = tableInstance();
            const testRow = instance.props.rows[0];
            const testRowId = MUITableUtils.rowId(testRow);
            instance.toggleRowSelected(testRow);
            expect(instance.state.selectedRows.indexOf(testRowId)).toBeGreaterThanOrEqual(0);
        });
        test("removes row if already selected", () => {
            const instance = tableInstance();
            const testRow = instance.props.rows[0];
            const testRowId = MUITableUtils.rowId(testRow);
            instance.toggleRowSelected(testRow);
            instance.toggleRowSelected(testRow);
            expect(instance.state.selectedRows.indexOf(testRowId)).toBeLessThan(0);
        });
    });
    describe("getFilterData", () => {
        test("it returns values", () => {
            const instance = tableInstance();
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBeGreaterThan(0);
        });
        test("it returns empty array if non-existent column passed", () => {
            const instance = tableInstance();
            const columnProp: StateColumn<any> = {
                ...DEFAULT_COL,
                name: "TEST 123456",
                title: "TEST 123456",
                type: "dimension"
            };
            const result = instance.getFilterData(columnProp);
            expect(result.length).toBe(0);
        });

        test("it returns empty array if no rows", () => {
            const instance = tableInstance({
                data: []
            });
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBe(0);
        });

        test("it handles rows not fitting column index", () => {
            const instance = tableInstance({
                columns: { static: EXAMPLE_COLUMNS.slice(0, 1) }
            });
            const initial = instance.getFilterData(instance.props.columns[0]);
            instance.props.rows[0] = [];
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBe(initial.length - 1);
        });

        test("it includes column.filterOptions.defaultOpts", () => {
            const instance = tableInstance({
                data: []
            });
            const defaultOpt = "TEST 123456";
            instance.props.columns[0].filterOptions = {
                exact: false,
                type: "checkbox",
                defaultOpts: [defaultOpt]
            };
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result[0]).toBe(defaultOpt);
        });
    });
    test("changePage", () => {
        const instance = tableInstance();
        const paginationState = { ...instance.state.pagination, page: 2 };
        instance.changePage(2);
        expect(instance.state.pagination).toMatchObject(paginationState);
    });
    describe("toggleSort", () => {
        test("it goes asc -> desc -> off", () => {
            const instance = tableInstance();
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: 1, asc: true });
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: 1, asc: false });
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: null, asc: true });
        });
    });
    test("changeRowsPerPage", () => {
        const instance = tableInstance();
        const paginationState = { ...instance.state.pagination, rowsPerPage: 2 };
        instance.changeRowsPerPage(2);
        expect(instance.state.pagination).toMatchObject(paginationState);
    });
    describe("handleAllSelect", () => {
        test("it sets selectedRows to [] if all selected already", () => {
            const instance = tableInstance();
            const selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(r => MUITableUtils.rowId(r));
            instance.setState({ selectedRows });
            instance.handleAllSelect();
            expect(instance.state.selectedRows.length).toBe(0);
        });
        test("it sets selectedRows to ALL if selectedRows.length < displayRows.length", () => {
            const instance = tableInstance();
            const selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(r => MUITableUtils.rowId(r));
            instance.setState({ selectedRows: ["ttest"] });
            instance.handleAllSelect();
            expect(instance.state.selectedRows.length).toBe(selectedRows.length);
        });
    });
});
