import React from "react";
import { Theme, WithStyles } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { useMUITableContext } from "../MUITable";

const styles = (theme: Theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5
    }
});

const PaginationActions = (props: WithStyles<typeof styles>) => {
    const { changePage, pagination, displayRows } = useMUITableContext();
    const { classes } = props;
    const { page } = pagination;
    const lastPage = displayRows.length / pagination.rowsPerPage;

    const handleFirstPageButtonClick = () => {
        changePage(0);
    };
    const handleBackButtonClick = () => {
        changePage(pagination.page - 1);
    };
    const handleNextButtonClick = () => {
        changePage(pagination.page + 1);
    };
    const handleLastPageButtonClick = () => {
        changePage(lastPage);
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="First Page"
            >
                <FirstPageIcon />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="Previous Page"
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(lastPage) - 1}
                aria-label="Next Page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(lastPage) - 1}
                aria-label="Last Page"
            >
                <LastPageIcon />
            </IconButton>
        </div>
    );
};

export const MUITablePaginationActions = withStyles(styles, { withTheme: true })(
    PaginationActions
) as React.FunctionComponent<{}>;
export default MUITablePaginationActions;
