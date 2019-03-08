import { createStyles, StyleRulesCallback, WithStyles } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import React from 'react';
import { useMUITableContext } from '../MUITable';
import MUITableToolbarSelect from '../Toolbars/MUITableToolbarSelect';
import MUITablePagination from './MUITablePagination';

const styles: StyleRulesCallback<any> = theme =>
    createStyles({
        root: {
            position: 'relative'
        },
        table: {}
    });

const MUITableFooter = (props: WithStyles<typeof styles>) => {
    const { classes } = props;
    const context = useMUITableContext();
    const { options } = context;
    if (options.pagination.customFooter) {
        return <Table>{options.pagination.customFooter(context)}</Table>;
    }
    if (!options.display.paginate) {
        return null;
    }
    return (
        <div className={classes.root}>
            {!options.rows.selectBarTop && <MUITableToolbarSelect />}
            <Table className={classes.table}>
                <MUITablePagination />
            </Table>
        </div>
    );
};
export default withStyles(styles, { withTheme: true, name: 'MUITableFooter' })(MUITableFooter);
