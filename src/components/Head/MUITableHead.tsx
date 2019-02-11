import { Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import MuiTableHead from '@material-ui/core/TableHead';
import classNames from 'classnames';
import React from 'react';
import { useMUITableContext } from '../MUITable';
import MUISummaryRow from '../Summary/SummaryRow';
import TableHeadCell from './MUITableHeadCell';
import TableHeadRow from './MUITableHeadRow';
import TableSelectCell from '../Body/MUITableSelectCell';

const defaultHeadStyles = (theme: Theme) => ({
    main: {},
    responsiveStacked: {
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
});

export interface MUITableHeadProps {}

interface Props extends MUITableHeadProps, WithStyles<typeof defaultHeadStyles> {}

export const MUITableHead = (props: Props) => {
    const { classes } = props;
    const { selectedRows, options, columns, viewColumns, displayRows } = useMUITableContext();
    const numSelected = (selectedRows && selectedRows.length) || 0;
    const isChecked = numSelected === displayRows.length;
    return (
        <MuiTableHead
            className={classNames({
                [classes.responsiveStacked]: options.display.responsive === 'stacked',
                [classes.main]: true
            })}
        >
            <TableHeadRow>
                <TableSelectCell checked={isChecked} isHeaderCell={true} />
                {columns.map(
                    (column, index) =>
                        viewColumns[index] &&
                        (column.customHeadRender ? (
                            column.customHeadRender(column)
                        ) : (
                            <TableHeadCell key={index} index={index} column={column}>
                                {column.title ? column.title : column.name}
                            </TableHeadCell>
                        ))
                )}
            </TableHeadRow>
            {options.rows.showSummaryRow && options.rows.summaryTop && <MUISummaryRow />}
        </MuiTableHead>
    );
};

export default withStyles(defaultHeadStyles, { name: 'MUITableHead' })(
    MUITableHead
) as React.FunctionComponent<MUITableHeadProps>;
