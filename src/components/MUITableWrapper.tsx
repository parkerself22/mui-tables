import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import React from 'react';
import MUITableBody from './Body/MUITableBody';
import MUITableFilterList from './Toolbars/Filters/MUITableFilterList';
import MUITableFooter from './Footer/MUITableFooter';
import MUITableHead from './Head/MUITableHead';
import { MUITableLoader } from './Head/MUITableLoader';
import MUITableToolbar from './Toolbars/MUITableToolbar';
import MUITableToolbarSelect from './Toolbars/MUITableToolbarSelect';
import { useMUITableContext } from './MUITable';

const classes = {
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
    caption: {
        position: 'absolute' as 'absolute',
        left: '-3000px'
    },
    liveAnnounce: {
        border: '0',
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute' as 'absolute',
        width: '1px'
    },
    paper: {
        position: 'relative' as 'relative'
    }
};

interface Props {
    loading: boolean;
}

const MUITableWrapper = (props: Props) => {
    const { loading } = props;
    const context = useMUITableContext();
    const { options, selectedRows } = context;
    const { title } = options;
    return (
        <Paper
            elevation={options.display.elevation ? options.display.elevation : 4}
            style={classes.paper}
        >
            <MUITableLoader loading={loading} />
            {selectedRows.length > 0 ? (
                <MUITableToolbarSelect />
            ) : (
                <MUITableToolbar context={context} />
            )}
            <MUITableFilterList />
            <div
                style={
                    options.display.responsive === 'scroll'
                        ? classes.responsiveScroll
                        : { position: 'relative' as 'relative' }
                }
            >
                <Table tabIndex={0} role={'grid'} style={classes.tableRoot}>
                    <caption style={classes.caption}>{title}</caption>
                    <MUITableHead />
                    <MUITableBody />
                </Table>
            </div>
            <MUITableFooter />
        </Paper>
    );
};
export default MUITableWrapper;
