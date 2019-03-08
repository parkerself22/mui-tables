import { Theme, WithStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import withStyles from '@material-ui/core/styles/withStyles';
import { TablePaginationActionsProps } from '@material-ui/core/TablePagination/TablePaginationActions';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import React from 'react';
import { useMUITableContext } from '../MUITable';

const styles = (theme: Theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5
    }
});

const PaginationActions = (props: TablePaginationActionsProps & WithStyles<typeof styles>) => {
    const { displayRows, options } = useMUITableContext();
    const textLabels = options.translations.pagination;
    const { classes, onChangePage, page, rowsPerPage } = props;
    const lastPage = displayRows.length / rowsPerPage - 1;

    const handleFirstPageButtonClick = (e: any) => {
        onChangePage(e, 0);
    };
    const handleBackButtonClick = (e: any) => {
        onChangePage(e, page - 1);
    };
    const handleNextButtonClick = (e: any) => {
        onChangePage(e, page + 1);
    };
    const handleLastPageButtonClick = (e: any) => {
        onChangePage(e, lastPage);
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label={textLabels.first}
                data-testid="First Page"
            >
                <FirstPageIcon />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label={textLabels.previous}
                data-testid="Previous Page"
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(lastPage) - 1}
                aria-label={textLabels.next}
                data-testid="Next Page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(lastPage) - 1}
                aria-label={textLabels.last}
                data-testid="Last Page"
            >
                <LastPageIcon />
            </IconButton>
        </div>
    );
};

export const MUITablePaginationActions = withStyles(styles, {
    withTheme: true,
    name: 'MUITablePaginationActions'
})(PaginationActions);
export default MUITablePaginationActions;
