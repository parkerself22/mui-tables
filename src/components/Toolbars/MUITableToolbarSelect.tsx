import { Grid } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import classNames from 'classnames';
import React from 'react';
import MUITableUtils from '../../constants/MUITableUtils';
import { useMUITableContext } from '../MUITable';

export interface MUITableToolbarSelectProps {}

interface Props extends MUITableToolbarSelectProps, WithStyles<typeof defaultToolbarSelectStyles> {}

const defaultToolbarSelectStyles = (theme: Theme) => ({
    root: {
        flex: '1 1 100%',
        display: 'none',
        height: 56,
        minHeight: "unset",
        zIndex: 120,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute' as 'absolute',
        left: 0,
        right: 0,
        width: 'auto'
    },
    active: {
        background: 'white',
        display: 'flex'
    },
    top: {
        top: 0,
        height: "100%",
        '&$active': {
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderRadius: "4px 4px 0"
        }
    },
    bottom: {
        bottom: 0,
        '&$active': {
            borderRadius: "0 0 4px 4px"
        }
    },
    title: {
        position: 'relative' as 'relative'
    },
    iconButton: {
        display: 'block',
        position: 'relative' as 'relative'
    },
    deleteIcon: {},
    titleGrid: {
        display: "flex" as "flex",
        justifyContent: "flex-start"
    },
    actionsGrid: {
        display: "flex" as "flex",
        justifyContent: "flex-end"
    }
});

const TableToolbarSelect = (props: Props) => {
    const { classes } = props;
    const { selectedRows, options, onRowsDelete, rows } = useMUITableContext();
    const textLabels = options.translations.selectedRows;
    const selectedRowData = rows.filter(r => {
        return selectedRows.indexOf(MUITableUtils.rowId(r)) >= 0;
    });
    const active = selectedRows.length > 0;
    const positionClass = options.rows.selectBarTop === false ? classes.bottom : classes.top;
    return (
        <Toolbar
            className={classNames(classes.root, positionClass, active && classes.active)}
            role={'select-toolbar'}
            aria-label={'Selected Toolbar'}
        >
            {options.rows.customToolbarSelect && selectedRows.length > 0 ? (
                options.rows.customToolbarSelect(selectedRowData)
            ) : selectedRows.length <= 0 ? null : (
                <React.Fragment>
                    <Grid item xs={4} className={classes.titleGrid}>
                        <Typography variant="subtitle1" className={classes.title}>
                            {selectedRows.length} {textLabels.text}
                        </Typography>
                    </Grid>
                    <Grid item xs={8} className={classes.actionsGrid} >
                        {options.rows.hideSelectDelete ? null : (
                            <Tooltip title={textLabels.delete}>
                                <IconButton
                                    className={classes.iconButton}
                                    onClick={onRowsDelete}
                                    aria-label={textLabels.deleteAria}
                                >
                                    <DeleteIcon className={classes.deleteIcon} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Grid>
                </React.Fragment>
            )}
        </Toolbar>
    );
};

export default withStyles(defaultToolbarSelectStyles, { name: 'MUITableToolbarSelect' })(
    TableToolbarSelect
) as React.ComponentType<MUITableToolbarSelectProps>;
