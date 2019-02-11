import Table from '@material-ui/core/Table';
import React from 'react';
import { useMUITableContext } from '../MUITable';
import MUITablePagination from './MUITablePagination';

const MUITableFooter = () => {
    const context = useMUITableContext();
    const { options } = context;
    if (options.pagination.customFooter) {
        return <Table>{options.pagination.customFooter(context)}</Table>;
    }
    if (!options.display.paginate) {
        return null;
    }
    return (
        <Table>
            <MUITablePagination />
        </Table>
    );
};
export default MUITableFooter;
