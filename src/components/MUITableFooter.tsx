import Table from "@material-ui/core/Table";
import React from "react";
import { useMUITableContext } from "../MUITable";
import MUITablePagination from "./MUITablePagination";

const MUITableFooter = () => {
    const { options, rows, changeRowsPerPage, changePage, pagination } = useMUITableContext();
    if (!options.display.paginate) {
        return null;
    }
    return (
        <Table>
            {options.pagination.customFooter ? (
                options.pagination.customFooter(
                    rows.length,
                    pagination.page,
                    pagination.rowsPerPage,
                    changeRowsPerPage,
                    changePage
                )
            ) : (
                <MUITablePagination />
            )}
        </Table>
    );
};
export default MUITableFooter;
