import { Theme, WithStyles, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FilterIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import React from 'react';
import MUITableDatePicker from './MUITableDatePicker';
import MUITableFilter from './Filters/MUITableFilter';
import Popover from './MUITablePopover';
import MUITableSearch from './MUITableSearch';
import MUITableViewCols from './MUITableViewCols';
import { Context } from '../../types/index';

export const defaultToolbarStyles = (theme: Theme) => ({
    root: {},
    leftBar: {
        flex: '1 1 55%'
    },
    actions: {
        flex: '0 0 45%',
        textAlign: 'right' as 'right'
    },
    titleRoot: {},
    titleText: {},
    icon: {
        '&:hover': {
            color: theme.palette.primary.main
        }
    },
    iconActive: {
        color: theme.palette.primary.main
    },
    searchIcon: {
        display: 'inline-flex',
        marginTop: '10px',
        marginRight: '8px'
    },
    [theme.breakpoints.down('sm')]: {
        titleRoot: {},
        titleText: {
            fontSize: '16px'
        },
        spacer: {
            display: 'none'
        },
        leftBar: {
            // flex: "1 1 40%",
            padding: '8px 0px'
        },
        actions: {
            // flex: "1 1 60%",
            textAlign: 'right' as 'right'
        }
    },
    [theme.breakpoints.down('xs')]: {
        root: {
            display: 'block'
        },
        leftBar: {
            padding: '8px 0px 0px 0px'
        },
        titleText: {
            textAlign: 'center' as 'center'
        },
        actions: {
            textAlign: 'center' as 'center'
        }
    }
});

export interface MUITableToolbarProps {
    context: Context;
}

interface Props extends MUITableToolbarProps, WithStyles<typeof defaultToolbarStyles> {}

interface State {
    iconActive: string | null;
}

class MUITableToolbar extends React.Component<Props, State> {
    searchButton: null | HTMLInputElement = null;

    state = {
        iconActive: null
    };

    setActiveIcon = (iconName: string | null) => () => {
        const { toggleSearchVisible } = this.props.context;
        this.setState(() => ({
            iconActive: iconName
        }));
    };

    getActiveIcon = (iconName: string) => {
        const { classes } = this.props;
        return this.state.iconActive !== iconName ? classes.icon : classes.iconActive;
    };

    toggleSearch = () => {
        const { toggleSearchVisible, search } = this.props.context;
        toggleSearchVisible();
        this.setState({
            iconActive: search.open ? null : 'search'
        });
    };

    render() {
        const { classes } = this.props;
        const {
            options: { translations, display, title },
            search
        } = this.props.context;
        const { viewColumns, filterTable } = translations.toolbar;

        return (
            <Toolbar className={classes.root} role={'toolbar'} aria-label={'Table Toolbar'}>
                <div className={classes.leftBar}>
                    {search.open ? (
                        <MUITableSearch
                            context={this.props.context}
                            toggleSearchVisible={this.toggleSearch}
                        />
                    ) : (
                        <div className={classes.titleRoot} aria-hidden={'true'}>
                            <Typography variant="h6" className={classes.titleText}>
                                {title}
                            </Typography>
                        </div>
                    )}
                </div>
                <div className={classes.actions}>
                    {display.search && (
                        <Tooltip title={translations.toolbar.search}>
                            <IconButton
                                aria-label={translations.toolbar.search}
                                buttonRef={el => (this.searchButton = el)}
                                classes={{ root: this.getActiveIcon('search') }}
                                onClick={this.toggleSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    {/**{tableOpts.download && (
                        <Tooltip title={downloadCsv}>
                            <IconButton
                                aria-label={downloadCsv}
                                classes={{ root: classes.icon }}
                                onClick={this.handleCSVDownload}
                            >
                                <DownloadIcon />
                            </IconButton>
                        </Tooltip>
                    )}*/}
                    {display.viewColumns && (
                        <Popover
                            refExit={this.setActiveIcon(null)}
                            refClose={this.setActiveIcon(null)}
                            open={this.state.iconActive === 'viewcolumns'}
                            trigger={
                                <IconButton
                                    aria-label={viewColumns}
                                    classes={{ root: this.getActiveIcon('viewcolumns') }}
                                    onClick={this.setActiveIcon('viewcolumns')}
                                >
                                    <Tooltip title={viewColumns}>
                                        <ViewColumnIcon />
                                    </Tooltip>
                                </IconButton>
                            }
                            content={<MUITableViewCols />}
                        />
                    )}
                    {display.filter && (
                        <Popover
                            refExit={this.setActiveIcon(null)}
                            refClose={this.setActiveIcon(null)}
                            open={this.state.iconActive === 'filter'}
                            trigger={
                                <IconButton
                                    aria-label={filterTable}
                                    classes={{ root: this.getActiveIcon('filter') }}
                                    onClick={this.setActiveIcon('filter')}
                                >
                                    <Tooltip title={filterTable}>
                                        <FilterIcon />
                                    </Tooltip>
                                </IconButton>
                            }
                            content={<MUITableFilter />}
                        />
                    )}
                    <MUITableDatePicker />
                </div>
            </Toolbar>
        );
    }
}

export default withStyles(defaultToolbarStyles, { name: 'MUIDataTableToolbar' })(
    MUITableToolbar
) as React.ComponentType<MUITableToolbarProps>;
