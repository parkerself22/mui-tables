import { Theme, WithStyles, withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FilterIcon from '@material-ui/icons/FilterList';
import SearchIcon from '@material-ui/icons/Search';
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import classNames from 'classnames';
import React from 'react';
import { MUITableContext } from '../../types';
import MUITableFilter from './Filters/MUITableFilter';
import MUITableDatePicker from './MUITableDatePicker';
import MUITableFixedSearch from './MUITableFixedSearch';
import Popover from './MUITablePopover';
import MUITableSearch from './MUITableSearch';
import MUITableViewCols from './MUITableViewCols';

export const defaultToolbarStyles = (theme: Theme) => ({
    root: {
        width: '100%'
    },
    selectActive: {
        visibility: 'hidden' as 'hidden'
    },
    leftBar: {
    },
    actions: {
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
    context: MUITableContext;
}

interface Props extends MUITableToolbarProps, WithStyles<typeof defaultToolbarStyles> {}

interface State {
    iconActive: string | null;
}

export class MUITableToolbar extends React.Component<Props, State> {
    searchButton: null | HTMLInputElement = null;

    state = {
        iconActive: null
    };

    setActiveIcon = (iconName: string | null) => () => {
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
        const { classes, context } = this.props;
        const { options, search, selectedRows } = context;
        const { translations, display, title, toolbar } = options;
        const { viewColumns, filterTable } = translations.toolbar;
        const hidden = options.rows.selectBarTop && selectedRows.length > 0;
        return toolbar.customToolbarFull ? ( /* Fragment  prevents errors if fn doesn't return*/
            <React.Fragment >
                { toolbar.customToolbarFull(context) }
            </React.Fragment>
        ) : (
            <Toolbar
                className={classNames(classes.root, hidden && classes.selectActive)}
                role={'toolbar'}
                aria-label={'Table Toolbar'}
            >
                <Grid container spacing={0} alignItems={"center"}>
                    <Grid item xs={6} className={classes.leftBar}>
                        {display.fixedSearch ? (
                            <MUITableFixedSearch />
                        ) : toolbar.customToolbarLeft ? (
                            toolbar.customToolbarLeft(context)
                        ) : search.open ? (
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
                    </Grid>
                    <Grid item xs={6} className={classes.actions}>
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
                    </Grid>
                </Grid>
                {toolbar.customToolbarBottom ? (
                    <Grid container spacing={0} alignItems={"center"}>
                        {toolbar.customToolbarBottom(context)}
                    </Grid>
                ) : null}
            </Toolbar>
        );
    }
}

export default withStyles(defaultToolbarStyles, { name: 'MUIDataTableToolbar' })(
    MUITableToolbar
) as React.ComponentType<MUITableToolbarProps>;
