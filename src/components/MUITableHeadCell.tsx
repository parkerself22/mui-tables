import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Tooltip from "@material-ui/core/Tooltip";
import classNames from "classnames";
import React from "react";
import { useMUITableContext } from "../MUITable";
import { StateColumn } from "../types";

const defaultHeadCellStyles = (theme: Theme) => ({
    root: {},
    fixedHeader: {
        position: "sticky" as "sticky",
        top: "0px",
        left: "0px",
        zIndex: 100,
        backgroundColor: theme.palette.background.paper,
        border: "none",
        "&::after": {
            content: `""`,
            zIndex: 400,
            position: "absolute" as "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            borderBottom: `1px solid ${theme.palette.divider}`
        }
    },
    tooltip: {
        cursor: "pointer"
    },
    mypopper: {
        "&[data-x-out-of-boundaries]": {
            display: "none"
        }
    },
    data: {
        display: "inline-block"
    },
    sortAction: {
        display: "inline-block",
        verticalAlign: "top",
        cursor: "pointer",
        paddingLeft: "4px",
        height: "10px"
    },
    sortActive: {
        color: theme.palette.text.primary
    },
    toolButton: {
        outline: "none",
        cursor: "pointer",
        display: "inline-flex" as "inline-flex",
        height: "auto"
    }
});

export interface MUITableHeadCellProps {
    column: StateColumn<any>;
    index: number;
    children: any;
}

interface Props extends MUITableHeadCellProps, WithStyles<typeof defaultHeadCellStyles> {}

const MUITableHeadCell = (props: Props) => {
    const { children, classes, column, index } = props;
    const {
        toggleSort,
        sortColumn,
        options: { display, translations }
    } = useMUITableContext();
    const handleSortClick = () => toggleSort(props.index);

    const sort = column.sort !== false && display.sort !== false;
    const sortActive = sort && sortColumn.index === index;
    const direction: "asc"|"desc"|undefined = sortColumn.asc ? "asc" : "desc";
    const sortLabelProps = {
        active: sortActive,
        ...(sortActive ? { direction } : {})
    };

    const cellClass = classNames({
        [classes.root]: true,
        [classes.fixedHeader]: display.fixedHeader
    });

    return (
        <TableCell className={cellClass} scope={"col"} sortDirection={sortActive && direction}>
            {sort ? (
                <Tooltip
                    title={translations.body.toolTip}
                    placement={"bottom-end"}
                    classes={{
                        tooltip: classes.tooltip,
                        popper: classes.mypopper
                    }}
                    enterDelay={300}
                >
                    <span
                        role="button"
                        onKeyUp={handleSortClick}
                        onClick={handleSortClick}
                        className={classes.toolButton}
                        tabIndex={0}
                    >
                        <div
                            className={classNames({
                                [classes.data]: true,
                                [classes.sortActive]: sortActive
                            })}
                        >
                            {column.customHeadRender ? column.customHeadRender(column) : children}
                        </div>
                        <div className={classes.sortAction}>
                            <TableSortLabel {...sortLabelProps} />
                        </div>
                    </span>
                </Tooltip>
            ) : (
                column.customHeadRender ? column.customHeadRender(column) : children
            )}
        </TableCell>
    );
};
export default withStyles(defaultHeadCellStyles, { name: "MUITableHeadCell" })(
    MUITableHeadCell
) as React.FunctionComponent<MUITableHeadCellProps>;
