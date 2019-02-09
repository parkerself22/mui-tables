import Chip from "@material-ui/core/Chip";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import React from "react";
import { useMUITableContext } from "../MUITable";
import { StateColumn } from "../types";

const defaultFilterListStyles = {
    root: {
        display: "flex",
        justifyContent: "left",
        flexWrap: "wrap" as "wrap",
        margin: "0px 16px 0px 16px"
    },
    chip: {
        margin: "8px 8px 0px 0px"
    }
};

export interface MUITableFilterListProps {}

interface Props extends MUITableFilterListProps, WithStyles<typeof defaultFilterListStyles> {}

const MUITableFilterList = (props: Props) => {
    const { onFilterUpdate, columns } = useMUITableContext();
    const { classes } = props;

    const filterUpdate = (col: StateColumn<any>, valueIndex: number, value: string) => () => {
        onFilterUpdate(col, valueIndex, value);
    };

    return (
        <div className={classes.root}>
            {columns
                .filter(c => !!c.filterOptions)
                .map((col, index) =>
                    !!col.filterOptions
                        ? col.filterOptions.currentList.map((data, valIndex) => (
                              <Chip
                                  label={data}
                                  key={`${index}-${valIndex}`}
                                  onDelete={filterUpdate(col, index, data)}
                                  className={classes.chip}
                              />
                          ))
                        : null
                )}
        </div>
    );
};

export default withStyles(defaultFilterListStyles)(MUITableFilterList) as React.FunctionComponent<
    MUITableFilterListProps
>;
