import React from 'react';
import { cleanup, render } from 'react-testing-library';
import sinon from 'sinon';
import MUITableBody from '../../../src/components/Body/MUITableBody';
import { DEFAULT_COL, DEFAULT_CONTEXT, DEFAULT_OPTS } from '../../../src/constants';
import { StateColumn } from '../../../src/types';
import { MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

describe('MUITableBody', () => {
    test('returns an empty row when no display rows exist', () => {
        const noDataText = DEFAULT_CONTEXT.options.translations.body.noMatch;
        const { getByText } = render(
            <MUITableTestContext override={{ displayRows: [] }}>
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText(noDataText)).not.toThrow();
    });
    test("doesn't return an empty row when display rows exist", () => {
        const noDataText = DEFAULT_CONTEXT.options.translations.body.noMatch;
        const { getByText } = render(
            <MUITableTestContext
                override={{ displayRows: [[{ display: '1', value: 1, column: DEFAULT_COL }]] }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText(noDataText)).toThrow();
    });
    test("gets the correct colSpan if rows selectable and data null", () => {
        const { container } = render(
            <MUITableTestContext
                override={{
                    columns: [DEFAULT_COL],
                    displayRows: [],
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            selectable: true
                        }
                    }
                }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        const row = container.querySelector('td[colspan="2"]');
        expect(row).not.toBe(null);
    });
    test("uses columns's customBodyRender", () => {
        const column = {
            ...DEFAULT_COL,
            customBodyRender: (col: any) => <p role={'textCustom'}>1</p>
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext override={{ displayRows: [[{ column, display: '1', value: 1 }]] }}>
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByRole('textCustom')).not.toThrow();
    });
    test('renders normal cells', () => {
        const column = {
            ...DEFAULT_COL
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext
                override={{ displayRows: [[{ column, display: 'testCell-123', value: 1 }]] }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText('testCell-123')).not.toThrow();
    });
    test('handles pagination: false', () => {
        const column = {
            ...DEFAULT_COL
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext
                override={{
                    displayRows: [[{ column, display: 'testCell-123', value: 1 }]],
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: false
                        }
                    }
                }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText('testCell-123')).not.toThrow();
    });
    test('calls set row props', () => {
        const setRowProps = sandbox.spy();
        const column = {
            ...DEFAULT_COL
        };
        render(
            <MUITableTestContext
                override={{
                    displayRows: [[{ column, display: 'testCell-123', value: 1 }]],
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            setRowProps
                        }
                    }
                }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(setRowProps.called).toBe(true);
    });
    test('renders summary row', () => {
        const column = {
            ...DEFAULT_COL
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext
                override={{
                    displayRows: [[{ column, display: 'testCell-123', value: 1 }]],
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            selectable: true,
                            showSummaryRow: true,
                            summaryTop: false
                        }
                    }
                }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText("SUMMARY")).not.toThrow();
    });
    test('hides cells when column hidden normal cells', () => {
        const column: StateColumn<any> = {
            ...DEFAULT_COL,
            display: 'false'
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext
                override={{ displayRows: [[{ column, display: 'testCell-123', value: 1 }]] }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText('testCell-123')).toThrow();
    });
    test('hides cells when column hidden normal cells', () => {
        const column: StateColumn<any> = {
            ...DEFAULT_COL,
            display: 'false'
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext
                override={{ displayRows: [[{ column, display: 'testCell-123', value: 1 }]] }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText('testCell-123')).toThrow();
    });
});
