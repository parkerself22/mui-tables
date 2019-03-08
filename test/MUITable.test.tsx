import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { cleanup, render } from 'react-testing-library';
import sinon from 'sinon';
import MUITableDefault, { MUIChildTable, MUITable } from '../src/components/MUITable';
import MUITableWrapper from '../src/components/MUITableWrapper';
import { DEFAULT_COL, DEFAULT_OPTS } from '../src/constants';
import MUITableUtils from '../src/constants/MUITableUtils';
import { Optional, ParentProps, StateColumn } from '../src/types';
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from './utils';

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

function tableInstance(props?: Optional<ParentProps<any>>): MUIChildTable {
    const ChildTable = MUITable({
        data: EXAMPLE_INPUT_DATA,
        columns: { static: EXAMPLE_COLUMNS },
        title: 'Test',
        loading: false,
        ...props
    });
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(ChildTable);
    const instance = renderer.getMountedInstance();
    return instance as MUIChildTable;
}

describe('MUITableParent', () => {
    test('default export renders', () => {
        const test = () =>
            render(
                <MUITableDefault
                    data={EXAMPLE_INPUT_DATA}
                    columns={{ static: EXAMPLE_COLUMNS }}
                    title={'test'}
                    loading={false}
                />
            );
        expect(test).not.toThrow();
    });
    test('calls sortColumns if provided', () => {
        const sortColumns = sandbox.spy((c: any) => c);
        MUITable({
            data: EXAMPLE_INPUT_DATA,
            columns: { sortColumns, static: EXAMPLE_COLUMNS },
            title: 'Test',
            loading: false
        });
        expect(sortColumns.called).toBe(true);
    });
    test('handles sortColumns throwing errors', () => {
        const sortColumns = sandbox.spy((c: any) => {
            throw new Error('test');
        });
        const test = () =>
            MUITable({
                data: EXAMPLE_INPUT_DATA,
                columns: { sortColumns, static: EXAMPLE_COLUMNS },
                title: 'Test',
                loading: false
            });
        expect(test).not.toThrow();
    });
    test('renders without crashing', () => {
        const test = () =>
            render(
                <MUITable
                    data={EXAMPLE_INPUT_DATA}
                    columns={{ static: EXAMPLE_COLUMNS }}
                    title={'test'}
                    loading={false}
                />
            );
        expect(test).not.toThrow();
    });
});
describe('MUITableChild', () => {
    describe('constructor', () => {
        test('uses initial paginate options', () => {
            const instance = tableInstance({
                pagination: {
                    ...DEFAULT_OPTS.pagination,
                    page: 2
                }
            });
            expect(instance.state.pagination.page).toBe(2);
        });
        test('uses default rowsPerPage & rowsPerPageOptions', () => {
            const instance = tableInstance({
                pagination: {
                    ...DEFAULT_OPTS.pagination,
                    rowsPerPage: undefined,
                    rowsPerPageOptions: undefined
                }
            });
            expect(instance.state.pagination.rowsPerPage).toBe(5);
            expect(instance.state.pagination.rowsPerPageOptions).toEqual([5, 10, 15]);
        });
        test('adds the initial rowsPerPage to rowsPerPageOptions if not found', () => {
            const instance = tableInstance({
                pagination: {
                    ...DEFAULT_OPTS.pagination,
                    rowsPerPage: 69,
                    rowsPerPageOptions: [5, 10, 15]
                }
            });
            expect(instance.state.pagination.rowsPerPage).toBe(69);
            expect(instance.state.pagination.rowsPerPageOptions).toEqual([5, 10, 15, 69]);
        });
    });
    test('sortedFilteredRows', () => {
        const instance = tableInstance();
        const result = instance.sortedFilteredRows();
        expect(result).toHaveProperty('displayRows');
        expect(result).toHaveProperty('rows');
    });
    describe('getVisibleColumns', () => {
        test('returns empty array when all filtered', () => {
            const instance = tableInstance();
            const viewColumns = instance.props.columns.map(c => false);
            instance.state = {
                ...instance.state,
                viewColumns
            };
            const result = instance.getVisibleColumns();
            expect(result).toHaveProperty('length');
            expect(result.length).toBe(0);
        });
        test('returns all when no active filters', () => {
            const instance = tableInstance();
            const viewColumns = instance.props.columns.map(c => true);
            instance.state = {
                ...instance.state,
                viewColumns
            };
            const result = instance.getVisibleColumns();
            expect(result).toHaveProperty('length');
            expect(result.length).toBe(instance.props.columns.length);
        });
    });
    describe('toggleViewColumn', () => {
        test('toggles the columns', () => {
            const instance = tableInstance();
            instance.toggleViewColumn(0);
            expect(instance.state.viewColumns[0]).toBe(false);
        });
        test('handles columns out of index', () => {
            const instance = tableInstance();
            instance.toggleViewColumn(69);
            expect(instance.state.viewColumns[69]).toBeUndefined();
        });
        test('calls onColumnViewChange hook', () => {
            const onColumnViewChange = sandbox.spy();
            const instance = tableInstance({
                hooks: {
                    onColumnViewChange
                }
            });
            instance.toggleViewColumn(0);
            expect(onColumnViewChange.called).toBe(true);
            expect(onColumnViewChange.calledOnceWith(instance.props.columns[0], false)).toBe(true);
        });
    });
    test('searchTextUpdate', () => {
        const instance = tableInstance();
        const searchText = 'test';
        instance.searchTextUpdate(searchText);
        expect(instance.state.search.text).toBe(searchText);
    });
    describe('toggleSearchVisible', () => {
        test('sets Text to null if opened -> closed', () => {
            const instance = tableInstance();
            instance.state = {
                ...instance.state,
                search: {
                    text: 'test',
                    open: true
                }
            };
            instance.toggleSearchVisible();
            expect(instance.state.search.text).toBe(null);
            expect(instance.state.search.open).toBe(false);
        });
        test('sets open: true closed -> opened', () => {
            const instance = tableInstance();
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
    describe('onFilterUpdate', () => {
        test('handles columns out of index', () => {
            const instance = tableInstance();
            instance.onFilterUpdate(69, 'test');
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test('sets colIndex val to array if array provided', () => {
            const instance = tableInstance();
            const value = ['t'];
            instance.onFilterUpdate(0, value);
            expect(instance.state.columnFilters[0][0]).toBe(value[0]);
        });
        test('sets 0 length if null string passed', () => {
            const instance = tableInstance();
            instance.onFilterUpdate(0, '');
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test('removes value if single existing value passed', () => {
            const instance = tableInstance();
            const value = ['t'];
            instance.state.columnFilters[0] = value;
            instance.onFilterUpdate(0, value[0]);
            expect(instance.state.columnFilters[0].length).toBe(0);
        });
        test('sets new array if single non-existing value passed', () => {
            const instance = tableInstance();
            const string = 't';
            instance.onFilterUpdate(0, string);
            expect(instance.state.columnFilters[0][0]).toBe(string);
        });
        test('calls onFilterChange hook', () => {
            const onFilterChange = sandbox.spy();
            const instance = tableInstance({
                hooks: {
                    onFilterChange
                }
            });
            const string = 't';
            instance.onFilterUpdate(0, string);
            expect(onFilterChange.called).toBe(true);
            expect(onFilterChange.calledOnceWith(string, instance.state.columnFilters)).toBe(
                true
            );
        });
    });
    describe('onFilterReset', () => {
        test('onFilterReset', () => {
            const instance = tableInstance();
            instance.onFilterReset();
            for (const col of instance.state.columnFilters) {
                expect(col.length).toBe(0);
            }
        });
        test('calls onFilterChange hook', () => {
            const onFilterChange = sandbox.spy();
            const instance = tableInstance({
                hooks: {
                    onFilterChange
                }
            });
            instance.onFilterReset();
            expect(onFilterChange.called).toBe(true);
            expect(onFilterChange.calledOnceWith([], instance.state.columnFilters)).toBe(true);
        });
    });
    describe('onRowsDelete', () => {
        test('calls hooks.onRowsDelete', () => {
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
        test('handles hooks.onRowsDelete errors', () => {
            const onRowsDelete = sandbox.spy(() => {
                throw new Error('test');
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
        test('works without hooks.onRowsDelete', () => {
            const onRowsDelete = sandbox.spy(() => {
                throw new Error('test');
            });
            const instance = tableInstance({
                ...DEFAULT_OPTS
            });
            const test = () => instance.onRowsDelete();
            expect(test).not.toThrow();
            expect(onRowsDelete.called).toBe(false);
        });
    });
    describe('toggleRowSelected', () => {
        test('adds row if not selected', () => {
            const instance = tableInstance();
            const testRow = instance.props.rows[0];
            const testRowId = MUITableUtils.rowId(testRow);
            instance.toggleRowSelected(testRow);
            expect(instance.state.selectedRows.indexOf(testRowId)).toBeGreaterThanOrEqual(0);
        });
        test('removes row if already selected', () => {
            const instance = tableInstance();
            const testRow = instance.props.rows[0];
            const testRowId = MUITableUtils.rowId(testRow);
            instance.toggleRowSelected(testRow);
            instance.toggleRowSelected(testRow);
            expect(instance.state.selectedRows.indexOf(testRowId)).toBeLessThan(0);
        });
        test('calls onRowsSelect hook', () => {
            const onRowsSelect = sandbox.spy();
            const instance = tableInstance({
                hooks: {
                    onRowsSelect
                }
            });
            const testRow = instance.props.rows[0];
            instance.toggleRowSelected(testRow);
            expect(onRowsSelect.called).toBe(true);
            expect(onRowsSelect.args[0]).toHaveLength(3);
            instance.toggleRowSelected(testRow);
            expect(onRowsSelect.args[1]).toHaveLength(3);
        });
    });
    describe('getFilterData', () => {
        test('it returns values', () => {
            const instance = tableInstance();
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBeGreaterThan(0);
        });
        test('it filters repeat values', () => {
            const instance = tableInstance({
                data: [
                    ...EXAMPLE_INPUT_DATA,
                    EXAMPLE_INPUT_DATA[0]
                ]
            });
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBeGreaterThan(0);
        });
        test('it returns empty array if non-existent column passed', () => {
            const instance = tableInstance();
            const columnProp: StateColumn<any> = {
                ...DEFAULT_COL,
                name: 'TEST 123456',
                title: 'TEST 123456',
                type: 'dimension'
            };
            const result = instance.getFilterData(columnProp);
            expect(result.length).toBe(0);
        });

        test('it returns empty array if no rows', () => {
            const instance = tableInstance({
                data: []
            });
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBe(0);
        });

        test('it handles rows not fitting column index', () => {
            const instance = tableInstance({
                columns: { static: EXAMPLE_COLUMNS.slice(0, 1) }
            });
            const initial = instance.getFilterData(instance.props.columns[0]);
            instance.props.rows[0] = [];
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result.length).toBe(initial.length - 1);
        });

        test('it includes column.filterOptions.defaultOpts', () => {
            const instance = tableInstance({
                data: []
            });
            const defaultOpt = 'TEST 123456';
            instance.props.columns[0].filterOptions = {
                exact: false,
                type: 'checkbox',
                defaultOpts: [defaultOpt]
            };
            const result = instance.getFilterData(instance.props.columns[0]);
            expect(result[0]).toBe(defaultOpt);
        });
    });
    test('changePage', () => {
        const instance = tableInstance();
        const paginationState = { ...instance.state.pagination, page: 2 };
        instance.changePage(2);
        expect(instance.state.pagination).toMatchObject(paginationState);
    });
    describe('toggleSort', () => {
        test('it goes asc -> desc -> off', () => {
            const instance = tableInstance();
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: 1, asc: true });
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: 1, asc: false });
            instance.toggleSort(1);
            expect(instance.state.sortColumn).toMatchObject({ index: null, asc: true });
        });
        test('it calls onColumnSortChange hook', () => {
            const onColumnSortChange = sandbox.spy();
            const instance = tableInstance({
                hooks: {
                    onColumnSortChange
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
    test('changeRowsPerPage', () => {
        const instance = tableInstance();
        const paginationState = { ...instance.state.pagination, rowsPerPage: 2 };
        instance.changeRowsPerPage(2);
        expect(instance.state.pagination).toMatchObject(paginationState);
    });
    describe('handleAllSelect', () => {
        test('it sets selectedRows to [] if all selected already', () => {
            const instance = tableInstance();
            const selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(r => MUITableUtils.rowId(r));
            instance.setState({ selectedRows });
            instance.handleAllSelect();
            expect(instance.state.selectedRows.length).toBe(0);
        });
        test('it sets selectedRows to ALL if selectedRows.length < displayRows.length', () => {
            const instance = tableInstance();
            const selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(r => MUITableUtils.rowId(r));
            instance.setState({ selectedRows: ['ttest'] });
            instance.handleAllSelect();
            expect(instance.state.selectedRows.length).toBe(selectedRows.length);
        });
        test('it calls onRowsSelect hook with correct args', () => {
            const onRowsSelect = sandbox.spy();
            const instance = tableInstance({
                hooks: {
                    onRowsSelect
                }
            });
            const selectedRows = instance
                .sortedFilteredRows()
                .displayRows.map(r => MUITableUtils.rowId(r));
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
describe('MUITableWrapper', () => {
    test('renders MUITableToolbarSelect when !selectBarTop', () => {
        const { getByTitle, getByText } = render(
            <MUITableTestContext
                override={{
                    selectedRows: ["test"]
                }}
            >
                <MUITableWrapper loading={false} />
            </MUITableTestContext>
        );
        const testDelButton = () => getByTitle("Delete");
        const testText = () => getByText("1 row(s) selected");
        expect(testDelButton).not.toThrow();
        expect(testText).not.toThrow();
    });
    test('renders MUITableToolbarSelect when selectBarTop', () => {
        const { getByTitle, getByText } = render(
            <MUITableTestContext
                override={{
                    selectedRows: ["test"],
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            selectBarTop: true
                        }
                    }
                }}
            >
                <MUITableWrapper loading={false} />
            </MUITableTestContext>
        );
        const testDelButton = () => getByTitle("Delete");
        const testText = () => getByText("1 row(s) selected");
        expect(testDelButton).not.toThrow();
        expect(testText).not.toThrow();
    });
    test('renders switched styles for responsive', () => {
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            responsive: 'stacked'
                        }
                    }
                }}
            >
                <MUITableWrapper loading={false} />
            </MUITableTestContext>
        );
        const styleDiv = getByTestId('responsive-style-div');
        expect(styleDiv.className.includes("responsiveStack")).toBe(true);
    });
    test('uses options.display.elevation', () => {
        const { container } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            elevation: 3
                        }
                    }
                }}
            >
                <MUITableWrapper loading={false} />
            </MUITableTestContext>
        );
        const styleDiv = container.querySelector('div[class*="MuiPaper-elevation3"]');
        const notFound = container.querySelector('div[class*="MuiPaper-elevation4"]');
        expect(styleDiv).not.toBe(null);
        expect(notFound).toBe(null);
    });
});
