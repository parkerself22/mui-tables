import React from "react";
import classNames from "classnames";
import TableCell from "@material-ui/core/TableCell";
import { Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { useMUITableContext } from "../MUITable";
import { Cell, Row } from "../types";

const defaultBodyCellStyles = (theme: Theme) => ({
    root: {},
    cellHide: {
        display: "none"
    },
    cellStacked: {
        [theme.breakpoints.down("sm")]: {
            display: "inline-block",
            backgroundColor: theme.palette.background.paper,
            fontSize: "16px",
            height: "24px",
            width: "calc(50% - 80px)",
            whiteSpace: "nowrap" as "nowrap"
        }
    },
    responsiveStacked: {
        [theme.breakpoints.down("sm")]: {
            display: "inline-block",
            fontSize: "16px",
            width: "calc(50% - 80px)",
            whiteSpace: "nowrap" as "nowrap",
            height: "24px"
        }
    }
});

interface MUITableBodyCellProps {
    cell?: Cell<any>;
    row?: Row<any>;
    rowIndex: number;
    className?: string;
    colSpan: number;
    children?: any;
    key: string;
}

interface Props extends MUITableBodyCellProps, WithStyles<typeof defaultBodyCellStyles> {}

const MUITableBodyCell = (props: Props) => {
    const { classes, cell, className, colSpan, row, rowIndex, key } = props;
    const {
        options: { hooks, display }
    } = useMUITableContext();
    const handleClick = () => {
        if (hooks && hooks.onCellClick && cell && row) {
            hooks.onCellClick(cell, row, rowIndex);
        }
    };

    return (
        <TableCell
            key={key}
            onClick={handleClick}
            colSpan={colSpan}
            className={classNames(
                {
                    [classes.root]: true,
                    [classes.responsiveStacked]: display.responsive === "stacked"
                },
                className
            )}
        >
            {props.children || !cell ? props.children : cell.display}
        </TableCell>
    );
};

export default withStyles(defaultBodyCellStyles, { name: "MUITableBodyCell" })(
    MUITableBodyCell
) as React.FunctionComponent<MUITableBodyCellProps>;
