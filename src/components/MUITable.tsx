import CssBaseline from '@material-ui/core/CssBaseline';
import React, { useContext } from 'react';
import { MUITABLE_DEF_CONTEXT } from '../constants';
import MUITableUtils from '../constants/MUITableUtils';
import {
    ContextActions,
    MUITableContext,
    ParentProps,
    Props,
    Row,
    State,
    StateColumn
} from '../types';
import MUITableWrapper from './MUITableWrapper';

export function useMUITableContext(): MUITableContext {
    const context = useContext<MUITableContext>(MUITABLE_DEF_CONTEXT);
    if (!context) {
        throw new Error(
            `MUITable child components cannot be rendered outside the MUITable component`
        );
    }
    return context as MUITableContext;
}

export class MUIChildTable extends React.Component<Props<any>, State<any>> {
    constructor(props: Props<any>) {
        super(props);
        const options = props.options;
        const paginateOptions = options.pagination;
        if (
            paginateOptions.rowsPerPage &&
            paginateOptions.rowsPerPageOptions &&
            paginateOptions.rowsPerPageOptions.indexOf(paginateOptions.rowsPerPage) < 0
        ) {
            paginateOptions.rowsPerPageOptions.push(paginateOptions.rowsPerPage);
        }
        this.state = {
            columnFilters: props.columns.map(() => []),
            selectedRows: [],
            search: {
                open: options.display.fixedSearch,
                text: null
            },
            viewColumns: props.columns.map(c => c.display === 'true'),
            sortColumn: {
                index: null,
                asc: false
            },
            pagination: {
                page: paginateOptions.page ? paginateOptions.page : 0,
                rowsPerPage: paginateOptions.rowsPerPage ? paginateOptions.rowsPerPage : 5,
                rowsPerPageOptions: paginateOptions.rowsPerPageOptions
                    ? paginateOptions.rowsPerPageOptions
                    : [5, 10, 15]
            }
        };
    }

    sortedFilteredRows = (/* join: boolean = true */) => {
        const { rows, columns, options } = this.props;
        const { viewColumns } = this.state;

        const preppedRows = MUITableUtils.mergeForHiddenColumns(rows, options, viewColumns);
        const sortedRows = MUITableUtils.sortRows(preppedRows, this.state, columns);
        const displayRows = MUITableUtils.filterRows(sortedRows, this.state, options, columns);

        return {
            displayRows,
            rows: sortedRows
        };
    };

    getVisibleColumns = () => {
        const { viewColumns } = this.state;
        const { columns } = this.props;
        return columns.filter((c, i) => !!viewColumns[i]);
    };

    toggleViewColumn = (i: number) => {
        const { options, columns } = this.props;
        const { viewColumns } = this.state;
        const newViewCols = [...viewColumns];
        if (newViewCols.hasOwnProperty(i)) {
            newViewCols[i] = !newViewCols[i];
            this.setState({ viewColumns: newViewCols });
            if (options.hooks && options.hooks.onColumnViewChange) {
                options.hooks.onColumnViewChange(columns[i], newViewCols[i]);
            }
        }
    };

    searchTextUpdate = (text: string | null) => {
        this.setState({ search: { ...this.state.search, text } });
    };

    toggleSearchVisible = () => {
        const { text, open } = this.state.search;
        this.setState({
            search: {
                text: open ? null : text,
                open: !open
            }
        });
    };

    onFilterUpdate = (colIndex: number, value: string | string[]) => {
        const { options } = this.props;
        const { columnFilters } = this.state;
        const newFilters = [...columnFilters];
        if (newFilters[colIndex]) {
            if (Array.isArray(value)) {
                newFilters[colIndex] = value;
            } else if (!value) {
                newFilters[colIndex] = [];
            } else if (newFilters[colIndex].indexOf(value) >= 0) {
                newFilters[colIndex] = newFilters[colIndex].filter(v => v !== value);
            } else {
                newFilters[colIndex] = [value];
            }
            this.setState({ columnFilters: newFilters });
            if (options.hooks && options.hooks.onFilterChange) {
                options.hooks.onFilterChange(value, newFilters);
            }
        }
    };

    onFilterReset = () => {
        const { columns, options } = this.props;
        const columnFilters = columns.map(() => []);
        if (options.hooks && options.hooks.onFilterChange) {
            options.hooks.onFilterChange([], columnFilters);
        }
        this.setState({ columnFilters });
    };

    onRowsDelete = () => {
        const { options, rows } = this.props;
        const { selectedRows } = this.state;
        if (options.hooks && options.hooks.onRowsDelete) {
            try {
                options.hooks.onRowsDelete(
                    rows.filter(r => selectedRows.indexOf(MUITableUtils.rowId(r)) >= 0)
                );
            } catch (e) {
                console.error(e);
            }
        }
    };

    toggleRowSelected = (row: Row<any>) => {
        const { options } = this.props;
        const { selectedRows } = this.state;
        const index = MUITableUtils.findRowIndex(row, selectedRows);
        const selectedRowIds =
            index < 0
                ? [...selectedRows, MUITableUtils.rowId(row)]
                : selectedRows.filter((r, i) => i !== index);
        this.setState({ selectedRows: selectedRowIds }, () => {
            if (options.hooks && options.hooks.onRowsSelect) {
                const currentSelected = this.sortedFilteredRows().rows.filter(
                    r => selectedRowIds.indexOf(MUITableUtils.rowId(r)) >= 0
                );
                options.hooks.onRowsSelect(
                    index < 0 ? [row] : [],
                    index < 0 ? [] : [row],
                    currentSelected
                );
            }
        });
    };

    getFilterData = (column: StateColumn<any>) => {
        const { rows, columns } = this.props;
        const colIndex = columns.findIndex(c => c.name === column.name);
        if (colIndex < 0) return [];
        const dynamicVals = rows.reduce(
            (opts, row) => {
                if (row[colIndex]) {
                    const opt = row[colIndex].display;
                    if (opt && opts.indexOf(opt) < 0) {
                        return [...opts, opt];
                    }
                }
                return opts;
            },
            [] as string[]
        );
        if (column.filterOptions && column.filterOptions.defaultOpts) {
            return [...column.filterOptions.defaultOpts, ...dynamicVals];
        }
        return dynamicVals;
    };

    changePage = (page: number) => {
        const { pagination } = this.state;
        this.setState({ pagination: { ...pagination, page } });
    };

    toggleSort = (colIndex: number) => {
        const { options, columns } = this.props;
        // default if it wasn't the sort column (we'll go asc, desc, off)
        let newState: Pick<State<any>, 'sortColumn'> = {
            sortColumn: { index: colIndex, asc: true }
        };
        if (this.state.sortColumn.index === colIndex) {
            if (this.state.sortColumn.asc) {
                // if asc, switch to desc
                newState = { sortColumn: { asc: false, index: colIndex } };
            } else {
                // if desc, switch to off (asc back to true)
                newState = { sortColumn: { index: null, asc: true } };
            }
        }
        this.setState(newState);
        if (options.hooks && options.hooks.onColumnSortChange) {
            const dir =
                newState.sortColumn.index === null
                    ? null
                    : newState.sortColumn.asc
                    ? 'asc'
                    : 'desc';
            options.hooks.onColumnSortChange(columns[colIndex], dir);
        }
    };

    changeRowsPerPage = (rows: number) => {
        const { pagination } = this.state;
        this.setState({
            pagination: { ...pagination, rowsPerPage: rows }
        });
    };

    handleAllSelect = () => {
        const { options } = this.props;
        const { displayRows } = this.sortedFilteredRows();
        const { selectedRows } = this.state;
        if (options.hooks && options.hooks.onRowsSelect) {
            const removedSelections = selectedRows.length === displayRows.length ? displayRows : [];
            const newSelections =
                selectedRows.length === displayRows.length
                    ? []
                    : displayRows.filter(d => selectedRows.indexOf(MUITableUtils.rowId(d)) < 0);

            options.hooks.onRowsSelect(
                newSelections,
                removedSelections,
                selectedRows.length === displayRows.length ? [] : displayRows
            );
        }
        if (selectedRows.length === displayRows.length) {
            this.setState({ selectedRows: [] });
        } else {
            this.setState({ selectedRows: displayRows.map(r => MUITableUtils.rowId(r)) });
        }
    };

    getContext: () => MUITableContext = () => {
        const { options, columns } = this.props;
        const { displayRows, rows } = this.sortedFilteredRows();
        const contextActions: ContextActions = {
            toggleViewColumn: this.toggleViewColumn,
            searchTextUpdate: this.searchTextUpdate,
            toggleSearchVisible: this.toggleSearchVisible,
            onFilterUpdate: this.onFilterUpdate,
            onFilterReset: this.onFilterReset,
            onRowsDelete: this.onRowsDelete,
            toggleRowSelected: this.toggleRowSelected,
            handleAllSelect: this.handleAllSelect,
            toggleSort: this.toggleSort,
            changePage: this.changePage,
            changeRowsPerPage: this.changeRowsPerPage,
            getFilterData: this.getFilterData,
            getVisibleColumns: this.getVisibleColumns
        };
        const contextState = {
            ...this.state,
            pagination: {
                ...this.state.pagination,
                rowsPerPageOptions:
                    options.pagination.rowsPerPageOptions ||
                    this.state.pagination.rowsPerPageOptions
            }
        };
        return {
            options,
            rows,
            columns,
            ...contextState,
            ...contextActions,
            displayRows
        };
    };

    render = () => {
        const { options } = this.props;
        const loading = options.loading;
        const context = this.getContext();

        return (
            <MUITABLE_DEF_CONTEXT.Provider value={context}>
                <CssBaseline />
                <MUITableWrapper loading={!!loading} />
            </MUITABLE_DEF_CONTEXT.Provider>
        );
    };
}

const MUIParentTable = (props: ParentProps<any>) => {
    const options = MUITableUtils.buildOptions(props);
    let columns = MUITableUtils.buildStaticColumns(
        props.data,
        options.columns.static,
        options.columns.generated
    );
    if (options.columns.sortColumns) {
        try {
            columns = options.columns.sortColumns(columns);
        } catch (e) {
            console.error(e);
        }
    }
    const rows = MUITableUtils.buildRows(props.data, columns, options);

    return <MUIChildTable options={options} data={props.data} columns={columns} rows={rows} />;
};

export const MUITable = MUIParentTable;
export default MUIParentTable;
