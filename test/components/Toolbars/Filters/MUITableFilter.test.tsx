import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import sinon from 'sinon';
import MUITableFilter, {
    MUITableMultiSelectFilter,
    MUITableSelectFilter
} from '../../../../src/components/Toolbars/Filters/MUITableFilter';
import MUITableFilterList from '../../../../src/components/Toolbars/Filters/MUITableFilterList';
import { DEFAULT_COL, DEFAULT_OPTS } from '../../../../src/constants';
import MUITableUtils from '../../../../src/constants/MUITableUtils';
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from '../../../utils';

const sandbox = sinon.createSandbox();
afterEach(cleanup);
afterAll(sandbox.restore);

describe('Filter Components', () => {
    describe('MUITableFilter', () => {
        test('renders with title', () => {
            const { getByText } = render(
                <MUITableTestContext>
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const test = () => getByText('FILTERS');
            expect(test).not.toThrow();
        });
        test('handles columns with filter = false', () => {
            const { getByText } = render(
                <MUITableTestContext override={{columns: [{
                        ...DEFAULT_COL,
                        filter: false
                    }, {
                        ...DEFAULT_COL,
                        filter: true,
                        filterOptions: undefined
                    }]}}>
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const test = () => getByText('FILTERS');
            expect(test).not.toThrow();
        });
        test('renders with reset button', () => {
            const { getByText } = render(
                <MUITableTestContext>
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const test = () => getByText('RESET');
            expect(test).not.toThrow();
        });

        test('renders MultiSelect (MUITableMultiSelectFilter)', () => {
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => ['t']);
            const columns = EXAMPLE_COLUMNS.map((c, i) => {
                if (c.filterOptions) {
                    c.filterOptions.type = 'multiselect';
                }
                if (i === 0) {
                    c.title = undefined;
                }
                return c;
            });
            const { getByText } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA
                    }}
                >
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const test = () => getByText('Date');
            expect(test).not.toThrow();
        });
        test('handles MultiSelect (MUITableMultiSelectFilter) change', () => {
            const onFilterUpdate = sandbox.spy();
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => []);
            const columns = EXAMPLE_COLUMNS.map(c => {
                if (c.filterOptions) {
                    c.filter = true;
                    c.filterOptions.type = 'multiselect';
                }
                return c;
            });
            const { getByTestId, getByRole } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        onFilterUpdate,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA,
                        getFilterData: () => ['ttt', 'ttt']
                    }}
                >
                    <MUITableFilter />
                </MUITableTestContext>
            );
            // @ts-ignore
            const child = getByTestId('MUITableMultiSelectFilterVal').parentElement;
            fireEvent.click(child as any);
            const opt = getByRole('listbox').firstChild;
            fireEvent.click(opt as any);
            expect(onFilterUpdate.called).toBe(true);
        });

        test('renders Select (MUITableSelectFilter)', () => {
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => ['t']);
            const columns = EXAMPLE_COLUMNS.map((c, i) => {
                if (c.filterOptions) {
                    c.filterOptions.type = 'dropdown';
                }
                if (i === 0) {
                    c.title = undefined;
                }
                return c;
            });
            const { getByText } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA
                    }}
                >
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const test = () => getByText('Date');
            expect(test).not.toThrow();
        });
        test('handles Select (MUITableSelectFilter) change', async () => {
            const onFilterUpdate = sandbox.spy();
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => ['t']);
            const columns = EXAMPLE_COLUMNS.map(c => {
                if (c.filterOptions) {
                    c.filterOptions.type = 'dropdown';
                }
                return c;
            });
            const { getByTestId, getByRole } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        onFilterUpdate,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA,
                        getFilterData: () => ['ttt', 'ttt']
                    }}
                >
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const child = getByTestId('MUITableSelectFilterVal').parentElement;
            fireEvent.click(child as any);
            const opt = getByRole('option');
            fireEvent.click(opt as any);
            expect(onFilterUpdate.called).toBe(true);
        });

        test('renders Checkboxes (MUITableCheckBoxFilter)', () => {
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => ['t']);
            const columns = EXAMPLE_COLUMNS.map((c, i) => {
                if (c.filterOptions) {
                    c.filterOptions.type = 'checkbox';
                }
                if (i === 0) {
                    c.title = undefined;
                }
                return c;
            });
            const { getByText } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA
                    }}
                >
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const test = () => getByText('Date');
            expect(test).not.toThrow();
        });
        test('handles Checkboxes (MUITableCheckBoxFilter) change', () => {
            const onFilterUpdate = sandbox.spy();
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => []);
            const columns = EXAMPLE_COLUMNS.map(c => {
                if (c.filterOptions) {
                    c.filter = true;
                    c.filterOptions.type = 'checkbox';
                }
                return c;
            });
            const { getByTestId } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        onFilterUpdate,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA,
                        getFilterData: () => ['ttt', 'ttt']
                    }}
                >
                    <MUITableFilter />
                </MUITableTestContext>
            );
            // @ts-ignore
            const child = getByTestId('MUITableCheckBoxFilterVal');
            fireEvent.click(child as any);
            expect(onFilterUpdate.called).toBe(true);
        });

        test('handles filterList removal', () => {
            const onFilterUpdate = sandbox.spy();
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => ['ttt']);
            const columns = EXAMPLE_COLUMNS.map(c => {
                if (c.filterOptions) {
                    c.filter = true;
                    c.filterOptions.type = 'checkbox';
                }
                return c;
            });
            const { getByRole } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        onFilterUpdate,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA
                    }}
                >
                    <MUITableFilterList />
                </MUITableTestContext>
            );
            // @ts-ignore
            const child = getByRole('presentation');
            fireEvent.click(child as any);
            expect(onFilterUpdate.called).toBe(true);
        });
    });
    describe('MultiSelect (MUITableMultiSelectFilter)', () => {
        test('handles null selectedValue', () => {
            const test = () =>
                render(
                    <MUITableTestContext>
                        <MUITableMultiSelectFilter
                            classes={{} as any}
                            column={EXAMPLE_COLUMNS[0]}
                            index={0}
                            currentValues={null as any}
                        />
                    </MUITableTestContext>
                );
            expect(test).not.toThrow();
        });
    });
    describe('Select (MUITableSelectFilter)', () => {
        test('handles change when not "All" selected', () => {
            const onFilterUpdate = sandbox.spy();
            const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS, DEFAULT_OPTS);
            const columnFilters = EXAMPLE_COLUMNS.map(c => ['t']);
            const columns = EXAMPLE_COLUMNS.map(c => {
                if (c.filterOptions) {
                    c.filterOptions.type = 'dropdown';
                }
                return c;
            });
            const { getByTestId, getAllByRole } = render(
                <MUITableTestContext
                    override={{
                        rows,
                        columnFilters,
                        columns,
                        onFilterUpdate,
                        displayRows: rows,
                        data: EXAMPLE_INPUT_DATA,
                        getFilterData: () => ['ttt', 'ttt']
                    }}
                >
                    <MUITableFilter />
                </MUITableTestContext>
            );
            const child = getByTestId('MUITableSelectFilterVal').parentElement;
            fireEvent.click(child as any);
            const opt = getAllByRole('option');
            fireEvent.click(opt[1] as any);
            expect(onFilterUpdate.called).toBe(true);
        });
        test('handles null selectedValue', () => {
            const test = () =>
                render(
                    <MUITableTestContext>
                        <MUITableSelectFilter
                            classes={{} as any}
                            column={EXAMPLE_COLUMNS[0]}
                            index={0}
                            currentValues={[]}
                        />
                    </MUITableTestContext>
                );
            expect(test).not.toThrow();
        });
    });
});
