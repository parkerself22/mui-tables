import Table from '@material-ui/core/Table';
import React from 'react';
import { useMUITableContext } from '../MUITable';
import MUITableToolbarSelect from '../Toolbars/MUITableToolbarSelect';
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
        <div style={{ position: 'relative' }}>
            {!options.rows.selectBarTop && <MUITableToolbarSelect />}
            <Table>
                <MUITablePagination />
            </Table>
        </div>
    );
};
export default MUITableFooter;
