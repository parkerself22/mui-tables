import { Theme, WithStyles, withStyles } from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell/TableCell';
import TableRow from '@material-ui/core/TableRow/TableRow';
import Typography from '@material-ui/core/Typography/Typography';
import classNames from 'classnames';
import React from 'react';
import { useMUITableContext } from '../MUITable';
import MUITableUtils from '../../constants/MUITableUtils';
import { SummaryRowCell } from '../../types/index';

const styles = (theme: Theme) => ({
    summaryTitle: {
        color: theme.palette.text.primary
    },
    emptyTitle: {
        textAlign: 'center' as 'center'
    },
    summaryRow: {},
    fixedHeader: {
        position: 'sticky' as 'sticky',
        top: 56,
        left: '0px',
        zIndex: 100,
        bottom: 0
    },
    summaryCell: {
        backgroundColor: theme.palette.grey['100'],
        border: 'none',
        '&::after': {
            content: `""`,
            zIndex: 400,
            position: 'absolute' as 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            borderBottom: `1px solid ${theme.palette.divider}`
        },
        '&::before': {
            content: `""`,
            zIndex: 400,
            position: 'absolute' as 'absolute',
            top: -1,
            left: 0,
            width: '100%',
            borderBottom: `1px solid ${theme.palette.divider}`,
            height: 1,
            background: theme.palette.background.paper
        }
    },
    summaryCaption: {
        color: theme.palette.text.secondary
    }
});

interface MUISummaryCellProps extends WithStyles<typeof styles> {
    summaryCell: SummaryRowCell;
    cellKey: string;
}

export const MUISummaryCell = (props: MUISummaryCellProps) => {
    const { classes, summaryCell, cellKey } = props;
    const { total, visible } = summaryCell;
    const { options } = useMUITableContext();
    const { column } = total;
    const percentTotal = (visible.value / total.value) * 100;

    let caption = `% of Total: ${percentTotal.toFixed(2)}% (${total.display})`;

    if (column.summaryOptions && column.summaryOptions.type === 'AVG') {
        const diff = -(1 - visible.value / total.value) * 100;
        caption = `Avg for All: ${total.display} (${diff.toFixed(2)}%)`;
    }

    const className = classNames({
        [classes.summaryCell]: true,
        [classes.fixedHeader]: options.display.fixedHeader
    });

    const isDiff = total.value !== visible.value;
    const showDiff =
        !column.summaryOptions ||
        !column.summaryOptions.showComparison ||
        (column.summaryOptions.showComparison === 'true' ||
            (column.summaryOptions.showComparison === 'whenDifferent' && isDiff));

    return (
        <TableCell colSpan={1} className={className} key={cellKey}>
            {column.summary && (
                <React.Fragment>
                    <Typography
                        className={classes.summaryTitle}
                        variant={'body1'}
                        role={`summaryTitle`}
                    >
                        {visible.display}
                    </Typography>
                    {showDiff && (
                        <Typography
                            className={classes.summaryCaption}
                            variant={'caption'}
                            role={'summaryCaption'}
                        >
                            {caption}
                        </Typography>
                    )}
                </React.Fragment>
            )}
        </TableCell>
    );
};

const MUISummaryTitle = (props: WithStyles<typeof styles>) => {
    const { classes } = props;
    const { options } = useMUITableContext();
    const className = classNames({
        [classes.summaryCell]: true,
        [classes.fixedHeader]: options.display.fixedHeader
    });

    return (
        <TableCell colSpan={1} className={className} key={'0'}>
            <Typography className={classes.summaryTitle} variant={'body2'} role={'summaryHead'}>
                {options.translations.body.summary}
            </Typography>
        </TableCell>
    );
};

const SummaryRow = (props: WithStyles<typeof styles>) => {
    const { classes } = props;
    const { displayRows, columns, viewColumns, rows, options } = useMUITableContext();
    const summaryRow = MUITableUtils.calculateSummaryRow(displayRows, rows, columns);
    return (
        <TableRow key={displayRows.length + 1} className={classes.summaryRow}>
            {options.rows.selectable && <MUISummaryTitle classes={classes} />}
            {summaryRow.map((cell, index) => {
                if (cell.visible.column.display === 'true' && viewColumns[index] !== false) {
                    if (index === 0 && !options.rows.selectable && cell.visible.value === null) {
                        return <MUISummaryTitle classes={classes} />;
                    }
                    return (
                        <MUISummaryCell
                            cellKey={index.toString()}
                            summaryCell={cell}
                            classes={classes}
                        />
                    );
                }
            })}
        </TableRow>
    );
};
export default withStyles(styles, { name: 'MUITableSummaryRow' })(SummaryRow);
