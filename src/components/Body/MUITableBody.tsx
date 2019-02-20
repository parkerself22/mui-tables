import MuiTableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import MUITableUtils from '../../constants/MUITableUtils';
import { Row } from '../../types';
import { useMUITableContext } from '../MUITable';
import MUISummaryRow from '../Summary/SummaryRow';
import MUITableBodyCell from './MUITableBodyCell';
import MUITableBodyRow from './MUITableBodyRow';
import MUITableSelectCell from './MUITableSelectCell';

const classes = {
    root: {},
    emptyTitle: {
        textAlign: 'center' as 'center'
    }
};

const MUITableBody = () => {
    const {
        displayRows,
        columns,
        options,
        selectedRows,
        viewColumns,
        pagination
    } = useMUITableContext();
    const isRowSelected = (row: Row) => MUITableUtils.findRowIndex(row, selectedRows) >= 0;

    // Pagination for displayRows
    const start = options.display.paginate ? pagination.rowsPerPage * pagination.page : 0;
    const end = options.display.paginate ? start + pagination.rowsPerPage : displayRows.length;

    const tableRows = [...displayRows].slice(start, end);

    if (tableRows.length <= 0) {
        return (
            <MUITableBodyRow index={0}>
                <MUITableBodyCell
                    key={'0'}
                    colSpan={options.rows.selectable ? columns.length + 1 : columns.length}
                    rowIndex={0}
                >
                    <Typography variant="subtitle1" style={classes.emptyTitle}>
                        {options.translations.body.noMatch}
                    </Typography>
                </MUITableBodyCell>
            </MUITableBodyRow>
        );
    }
    const setRowProps = options.rows.setRowProps;
    return (
        <MuiTableBody>
            {tableRows.map((row, rowIndex) => (
                <MUITableBodyRow
                    index={rowIndex}
                    key={rowIndex}
                    {...(setRowProps ? setRowProps(row, rowIndex) : {})}
                >
                    <MUITableSelectCell
                        row={row}
                        checked={isRowSelected(row)}
                        isHeaderCell={false}
                    />
                    {row.map((cell, columnIndex) => {
                        const shouldDisplay =
                            cell.column.display !== 'false' &&
                            cell.column.display !== 'excluded' &&
                            viewColumns[columnIndex] !== false;
                        if (!shouldDisplay) {
                            return null;
                        }
                        return cell.column.customBodyRender ? (
                            <MUITableBodyCell
                                colSpan={1}
                                rowIndex={rowIndex}
                                key={`${rowIndex}-${columnIndex}`}
                            >
                                {cell.column.customBodyRender(cell, row)}
                            </MUITableBodyCell>
                        ) : (
                            <MUITableBodyCell
                                cell={cell}
                                row={row}
                                colSpan={1}
                                rowIndex={rowIndex}
                                key={`${rowIndex}-${columnIndex}`}
                            />
                        );
                    })}
                </MUITableBodyRow>
            ))}
            {options.rows.showSummaryRow && !options.rows.summaryTop && <MUISummaryRow />}
        </MuiTableBody>
    );
};

export default MUITableBody;
