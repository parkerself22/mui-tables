import { WithStyles, withStyles } from '@material-ui/core/styles';
import MuiTableFooter from '@material-ui/core/TableFooter';
import MuiTablePagination from '@material-ui/core/TablePagination';
import MuiTableRow from '@material-ui/core/TableRow';
import React, { ChangeEvent } from 'react';
import { useMUITableContext } from '../MUITable';
import MUITablePaginationActions from './MUITablePaginationActions';

const defaultPaginationStyles = {
    root: {
        '&:last-child': {
            padding: '0px 24px 0px 24px'
        }
    },
    toolbar: {},
    selectRoot: {},
    '@media screen and (max-width: 400px)': {
        toolbar: {
            '& span:nth-child(2)': {
                display: 'none'
            }
        },
        selectRoot: {
            marginRight: '8px'
        }
    }
};

export interface MUITablePaginationProps {}

interface Props extends MUITablePaginationProps, WithStyles<typeof defaultPaginationStyles> {}

const MUITablePagination = (props: Props & any) => {
    const { classes } = props;
    const {
        options,
        changePage,
        changeRowsPerPage,
        pagination,
        displayRows
    } = useMUITableContext();
    const { translations } = options;
    if (!options.display.paginate) {
        return null;
    }
    const onChangeRowsPerPage = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const rows = parseInt(event.target.value, 10);
        changeRowsPerPage(rows);
        if (options.hooks && options.hooks.onChangeRowsPerPage) {
            options.hooks.onChangeRowsPerPage(rows);
        }
    };
    const textLabels = translations.pagination;
    const onChangePage = (e: any, page: number) => {
        changePage(page);
        if (options.hooks && options.hooks.onChangePage) {
            options.hooks.onChangePage(page);
        }
    };
    return (
        <MuiTableFooter>
            <MuiTableRow>
                <MuiTablePagination
                    className={classes.root}
                    classes={{
                        toolbar: classes.toolbar,
                        selectRoot: classes.selectRoot
                    }}
                    SelectProps={{ title: 'MUITable-rowsPerPageSelect' }}
                    count={displayRows.length}
                    rowsPerPage={pagination.rowsPerPage}
                    page={pagination.page}
                    labelRowsPerPage={textLabels.rowsPerPage}
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} ${textLabels.displayRows} ${count}`
                    }
                    backIconButtonProps={{
                        'aria-label': textLabels.previous
                    }}
                    nextIconButtonProps={{
                        'aria-label': textLabels.next
                    }}
                    rowsPerPageOptions={pagination.rowsPerPageOptions}
                    onChangePage={onChangePage}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    ActionsComponent={props => <MUITablePaginationActions {...props} />}
                />
            </MuiTableRow>
        </MuiTableFooter>
    );
};

export default withStyles(defaultPaginationStyles, { name: 'MUITablePagination' })(
    MUITablePagination
) as React.FunctionComponent<MUITablePaginationProps & any>;
