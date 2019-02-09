import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { useMUITableContext } from "../MUITable";
import MUITableUtils from "../MUITableUtils";

const defaultToolbarSelectStyles = (theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.background.default,
        flex: "1 1 100%",
        display: "flex",
        height: "64px",
        position: "relative" as "relative",
        zIndex: 120,
        justifyContent: "space-between"
    },
    title: {
        paddingLeft: "26px",
        top: "50%",
        position: "relative" as "relative",
        transform: "translateY(-50%)"
    },
    iconButton: {
        marginRight: "24px",
        top: "50%",
        display: "block",
        position: "relative" as "relative",
        transform: "translateY(-50%)"
    },
    deleteIcon: {}
});

export interface MUITableToolbarSelectProps {}

interface Props extends MUITableToolbarSelectProps, WithStyles<typeof defaultToolbarSelectStyles> {}

const TableToolbarSelect = (props: Props) => {
    const { classes } = props;
    const { selectedRows, options, onRowsDelete, rows } = useMUITableContext();
    const textLabels = options.translations.selectedRows;
    const selectedRowData = rows.filter(r => selectedRows.indexOf(MUITableUtils.rowId(r)) >= 0);
    return (
        <Paper className={classes.root}>
            <div>
                <Typography variant="subtitle1" className={classes.title}>
                    {selectedRows.length} {textLabels.text}
                </Typography>
            </div>
            {options.rows.customToolbarSelect ? (
                options.rows.customToolbarSelect(selectedRowData)
            ) : (
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
        </Paper>
    );
};

export default withStyles(defaultToolbarSelectStyles, { name: "MUITableToolbarSelect" })(
    TableToolbarSelect
) as React.ComponentType<MUITableToolbarSelectProps>;
