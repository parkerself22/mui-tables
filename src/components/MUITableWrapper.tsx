import { createStyles, Grid, StyleRulesCallback, WithStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Table from '@material-ui/core/Table';
import React from 'react';
import MUITableBody from './Body/MUITableBody';
import MUITableFooter from './Footer/MUITableFooter';
import MUITableHead from './Head/MUITableHead';
import { MUITableLoader } from './Head/MUITableLoader';
import { useMUITableContext } from './MUITable';
import MUITableFilterList from './Toolbars/Filters/MUITableFilterList';
import MUITableToolbar from './Toolbars/MUITableToolbar';
import MUITableToolbarSelect from './Toolbars/MUITableToolbarSelect';

const styles: StyleRulesCallback<any> = theme =>
    createStyles({
        root: {},
        tableRoot: {
            outline: 'none',
            position: 'relative' as 'relative',
            width: '100%'
        },
        responsiveScroll: {
            overflowX: 'auto' as 'auto',
            overflow: 'auto' as 'auto',
            height: '100%',
            maxHeight: '499px'
        },
        responsiveStack: {},
        caption: {
            position: 'absolute' as 'absolute',
            left: '-3000px'
        },
        paper: {
            position: 'relative' as 'relative'
        },
        toolbarGrid: {
            position: 'relative' as 'relative'
        }
    });

interface Props {
    loading: boolean;
}

const MUITableWrapper = (props: Props & WithStyles<typeof styles>) => {
    const { loading, classes } = props;
    const context = useMUITableContext();
    const { options } = context;
    const { title } = options;
    return (
        <Paper elevation={options.display.elevation} className={classes.paper}>
            <MUITableLoader loading={loading} />
            <Grid container spacing={0} className={classes.toolbarGrid}>
                <MUITableToolbar context={context} />
                {options.rows.selectBarTop && <MUITableToolbarSelect />}
            </Grid>
            <MUITableFilterList />
            <div
                data-testid="responsive-style-div"
                className={
                    options.display.responsive === 'scroll'
                        ? classes.responsiveScroll
                        : classes.responsiveStack
                }
            >
                <Table tabIndex={0} role={'grid'} className={classes.tableRoot}>
                    <caption className={classes.caption}>{title}</caption>
                    <MUITableHead />
                    <MUITableBody />
                </Table>
            </div>
            <MUITableFooter />
        </Paper>
    );
};

export default withStyles(styles, { withTheme: true, name: 'MUITableWrapper' })(MUITableWrapper);
