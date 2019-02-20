import React from 'react';
import { cleanup, render } from 'react-testing-library';
import MUISummaryRow, { MUISummaryCell } from '../../../src/components/Summary/SummaryRow';
import { DEFAULT_COL, DEFAULT_OPTS } from '../../../src/constants';
import MUITableUtils from '../../../src/constants/MUITableUtils';
import { MUITableContext, Optional, Row, StateColumn } from '../../../src/types';
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from '../../utils';

afterEach(cleanup);
describe('MUISummaryCell', () => {
    test('returns empty cell when summary is false', () => {
        const column = {
            ...DEFAULT_COL,
            summary: false
        };
        const summaryCell = {
            visible: { column, value: 1, display: '1' },
            total: { column, value: 1, display: '1' }
        };
        const { getByRole } = render(
            <MUITableTestContext>
                <MUISummaryCell cellKey={'1'} summaryCell={summaryCell} classes={{} as any} />
            </MUITableTestContext>
        );
        expect(() => getByRole('summaryTitle')).toThrow();
    });
    test('shows summary when summary is true', () => {
        const column = {
            ...DEFAULT_COL,
            summary: true
        };
        const summaryCell = {
            visible: { column, value: 1, display: '1' },
            total: { column, value: 1, display: '1' }
        };
        const { getByRole } = render(
            <MUITableTestContext>
                <MUISummaryCell cellKey={'1'} summaryCell={summaryCell} classes={{} as any} />
            </MUITableTestContext>
        );
        expect(() => getByRole('summaryTitle')).not.toThrow();
    });
    test("averages the totals for summaryOptions.type: 'AVG'", () => {
        const column: StateColumn<any> = {
            ...DEFAULT_COL,
            summary: true,
            summaryOptions: {
                format: 'integer',
                type: 'AVG'
            }
        };
        const summaryCell = {
            visible: { column, value: 1, display: '1' },
            total: { column, value: 1, display: '1' }
        };
        const { getByText } = render(
            <MUITableTestContext>
                <MUISummaryCell cellKey={'1'} summaryCell={summaryCell} classes={{} as any} />
            </MUITableTestContext>
        );
        expect(() => getByText('Avg for All: 1 (0.00%)')).not.toThrow();
    });
    test("shows caption when showComparison is 'true'", () => {
        const column: StateColumn<any> = {
            ...DEFAULT_COL,
            summary: true,
            summaryOptions: {
                showComparison: 'true',
                format: 'float',
                type: 'SUM'
            }
        };
        const summaryCell = {
            visible: { column, value: 1, display: '1' },
            total: { column, value: 1, display: '1' }
        };
        const { getByRole } = render(
            <MUITableTestContext>
                <MUISummaryCell cellKey={'1'} summaryCell={summaryCell} classes={{} as any} />
            </MUITableTestContext>
        );
        expect(() => getByRole('summaryCaption')).not.toThrow();
    });
    test("doesnt caption when showComparison is 'false'", () => {
        const column: StateColumn<any> = {
            ...DEFAULT_COL,
            summary: true,
            summaryOptions: {
                showComparison: 'false',
                format: 'float',
                type: 'SUM'
            }
        };
        const summaryCell = {
            visible: { column, value: 1, display: '1' },
            total: { column, value: 1, display: '1' }
        };
        const { getByRole } = render(
            <MUITableTestContext>
                <MUISummaryCell cellKey={'1'} summaryCell={summaryCell} classes={{} as any} />
            </MUITableTestContext>
        );
        expect(() => getByRole('summaryCaption')).toThrow();
    });
});
describe('MUISummaryRow', () => {
    test('has a header cell', () => {
        const column = {
            ...DEFAULT_COL,
            summary: false
        };
        const rows: Row[] = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, [column], DEFAULT_OPTS);
        const contextPartial: Optional<MUITableContext> = {
            rows,
            displayRows: rows,
            columns: [column]
        };
        const { getByRole } = render(
            <MUITableTestContext override={contextPartial}>
                <MUISummaryRow />
            </MUITableTestContext>
        );
        expect(() => getByRole('summaryHead')).not.toThrow();
    });
    test('renders summary cells', () => {
        const rows: Row[] = MUITableUtils.buildRows(
            EXAMPLE_INPUT_DATA,
            EXAMPLE_COLUMNS,
            DEFAULT_OPTS
        );
        const contextPartial: Optional<MUITableContext> = {
            rows,
            displayRows: rows,
            columns: EXAMPLE_COLUMNS
        };
        const { getByRole } = render(
            <MUITableTestContext override={contextPartial}>
                <MUISummaryRow />
            </MUITableTestContext>
        );
        expect(() => getByRole('summaryTitle')).not.toThrow();
    });
    test('handles whenDifferent summary opt', () => {
        const rows: Row[] = MUITableUtils.buildRows(
            EXAMPLE_INPUT_DATA,
            EXAMPLE_COLUMNS,
            DEFAULT_OPTS
        );
        const contextPartial: Optional<MUITableContext> = {
            rows,
            columns: EXAMPLE_COLUMNS,
            displayRows: [rows[0]]
        };
        const { getByText } = render(
            <MUITableTestContext override={contextPartial}>
                <MUISummaryRow />
            </MUITableTestContext>
        );
        expect(() => getByText('SUMMARY')).not.toThrow();
    });
    test('doesnt render cell if column hidden', () => {
        const rows: Row[] = MUITableUtils.buildRows(
            EXAMPLE_INPUT_DATA,
            EXAMPLE_COLUMNS,
            DEFAULT_OPTS
        );

        const contextPartial: Optional<MUITableContext> = {
            rows,
            displayRows: [rows[0]],
            columns: EXAMPLE_COLUMNS,
            viewColumns: EXAMPLE_COLUMNS.map((c, i) => i !== 0)
        };
        const test = () =>
            render(
                <MUITableTestContext override={contextPartial}>
                    <MUISummaryRow />
                </MUITableTestContext>
            );
        expect(test).not.toThrow();
    });
});
