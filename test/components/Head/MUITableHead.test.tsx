import React from 'react';
import { cleanup, fireEvent, render } from 'react-testing-library';
import sinon from 'sinon';
import MUITableHead from '../../../src/components/Head/MUITableHead';
import MUITableHeadCell from '../../../src/components/Head/MUITableHeadCell';
import { DEFAULT_OPTS } from '../../../src/constants';
import { EXAMPLE_COLUMNS, MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();

afterEach(() => {
    cleanup();
    sandbox.restore();
});

describe('MUITableHead', () => {
    test('renders column head cells', () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    columns: EXAMPLE_COLUMNS,
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS
                    }
                }}
            >
                <MUITableHead />
            </MUITableTestContext>
        );
        for (const col of EXAMPLE_COLUMNS) {
            const test = () => getByText(col.title ? col.title : col.name);
            expect(test).not.toThrow();
        }
    });
    test('handles columns without titles', () => {
        const column = {
            ...EXAMPLE_COLUMNS[0],
            title: undefined
        };
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    columns: [column],
                    viewColumns: [column].map(c => true),
                    options: {
                        ...DEFAULT_OPTS
                    }
                }}
            >
                <MUITableHead />
            </MUITableTestContext>
        );
        const test = () => getByText(column.name);
        expect(test).not.toThrow();
    });
    test('renders summaryRow if options.rows.showSummaryRow && options.rows.summaryTop', () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    columns: EXAMPLE_COLUMNS,
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            showSummaryRow: true,
                            summaryTop: true
                        }
                    }
                }}
            >
                <MUITableHead />
            </MUITableTestContext>
        );
        const test = () => getByText('SUMMARY');
        expect(test).not.toThrow();
    });
});
describe('MUITableHeadCell', () => {
    test('renders sortLabel if column sorted asc', () => {
        const { queryByRole } = render(
            <MUITableTestContext
                override={{
                    columns: EXAMPLE_COLUMNS,
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            showSummaryRow: true,
                            summaryTop: true
                        }
                    },
                    sortColumn: {
                        index: 0,
                        asc: true
                    }
                }}
            >
                <MUITableHeadCell column={EXAMPLE_COLUMNS[0]} index={0} key={0}>
                    Test
                </MUITableHeadCell>
            </MUITableTestContext>
        );
        const test = () => queryByRole('presentation');
        expect(test).not.toThrow();
    });
    test('renders sortLabel if column sorted desc', () => {
        const { getByRole } = render(
            <MUITableTestContext
                override={{
                    columns: EXAMPLE_COLUMNS,
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            showSummaryRow: true,
                            summaryTop: true
                        }
                    },
                    sortColumn: {
                        index: 0,
                        asc: false
                    }
                }}
            >
                <MUITableHeadCell column={EXAMPLE_COLUMNS[0]} index={0} key={0}>
                    Test
                </MUITableHeadCell>
            </MUITableTestContext>
        );
        const test = () => getByRole('presentation');
        expect(test).not.toThrow();
    });
    test('calls toggleSort', () => {
        const toggleSort = sandbox.spy();
        const { getByRole } = render(
            <MUITableTestContext
                override={{
                    toggleSort,
                    columns: EXAMPLE_COLUMNS,
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            showSummaryRow: true,
                            summaryTop: true
                        }
                    },
                    sortColumn: {
                        index: 0,
                        asc: false
                    }
                }}
            >
                <MUITableHeadCell column={EXAMPLE_COLUMNS[0]} index={0} key={0}>
                    Test
                </MUITableHeadCell>
            </MUITableTestContext>
        );
        const button = getByRole('button');
        fireEvent.click(button as any);
        expect(toggleSort.called).toBe(true);
    });
    test('renders just children if sort = false', () => {
        const toggleSort = sandbox.spy();
        const noSortCol = { ...EXAMPLE_COLUMNS[0] };
        noSortCol.sort = false;
        const { getByRole, getByText } = render(
            <MUITableTestContext
                override={{
                    toggleSort,
                    columns: [noSortCol],
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows
                        },
                        display: {
                            ...DEFAULT_OPTS.display,
                            sort: false
                        }
                    }
                }}
            >
                <MUITableHeadCell column={noSortCol} index={0} key={0}>
                    Test
                </MUITableHeadCell>
            </MUITableTestContext>
        );
        const testButton = () => getByRole('button');
        expect(testButton).toThrow();
        const testText = () => getByText('Test');
        expect(testText).not.toThrow();
    });
    test('calls customHeadRender if sort = false', () => {
        const customHeadRender = sandbox.spy(() => "Test");
        const noSortCol = { ...EXAMPLE_COLUMNS[0] };
        noSortCol.sort = false;
        noSortCol.customHeadRender = customHeadRender;
        const { getByRole, getByText } = render(
            <MUITableTestContext
                override={{
                    columns: [noSortCol],
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows
                        },
                        display: {
                            ...DEFAULT_OPTS.display,
                            sort: false
                        }
                    }
                }}
            >
                <MUITableHeadCell column={noSortCol} index={0} key={0}>
                    Test
                </MUITableHeadCell>
            </MUITableTestContext>
        );
        expect(customHeadRender.called).toBe(true);
        const testText = () => getByText('Test');
        expect(testText).not.toThrow();
    });
    test('calls customHeadRender if sort = true', () => {
        const customHeadRender = sandbox.spy(() => "Test");
        const noSortCol = { ...EXAMPLE_COLUMNS[0] };
        noSortCol.customHeadRender = customHeadRender;
        const { getByRole, getByText } = render(
            <MUITableTestContext
                override={{
                    columns: [noSortCol],
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows
                        }
                    }
                }}
            >
                <MUITableHeadCell column={noSortCol} index={0} key={0}>
                    Test
                </MUITableHeadCell>
            </MUITableTestContext>
        );
        expect(customHeadRender.called).toBe(true);
        const testText = () => getByText('Test');
        expect(testText).not.toThrow();
    });
});
