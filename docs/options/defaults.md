# Defaults

## Exports

The package exports some defaults as a convenience:

```javascript
// node_modules/mui-tables/index.js
export const MUITableDefaults = {
    context: MUITABLE_DEF_CONTEXT,
    props: DEFAULT_PROPS,
    column: DEFAULT_COL
};

// your_code.js
import { MUITableDefaults } from 'mui-tables';
const myProps = {
    ...MUITableDefaults.props,
    ...yourCode  
}
```

## **Default Props**

```typescript
const DEFAULT_PROPS: Options = {
    title: 'Table',
    loading: false,
    toolbar: {
        showDates: false
    },
    columns: {
        static: [],
        generated: []
    },
    rows: {
        rowHover: false,
        showSummaryRow: false,
        summaryTop: true,
        selectable: false,
        skipDuplicates: false,
        mergeDuplicates: false,
        hiddenColumnMerge: false
    },
    pagination: {
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 25, 50]
    },
    translations: {
        body: {
            noMatch: 'Sorry, no matching records found',
            toolTip: 'Sort',
            summary: 'SUMMARY'
        },
        pagination: {
            next: 'Next Page',
            previous: 'Previous Page',
            first: 'First Page',
            last: 'Last Page',
            rowsPerPage: 'Rows per page:',
            displayRows: 'of'
        },
        toolbar: {
            search: 'Search',
            downloadCsv: 'Download CSV',
            print: 'Print',
            viewColumns: 'View Columns',
            filterTable: 'Filter Table'
        },
        filter: {
            all: 'All',
            title: 'FILTERS',
            reset: 'RESET'
        },
        viewColumns: {
            title: 'Show Columns',
            titleAria: 'Show/Hide Table Columns'
        },
        selectedRows: {
            text: 'row(s) selected',
            delete: 'Delete',
            deleteAria: 'Delete Selected Rows'
        }
    },
    display: {
        sort: true,
        paginate: true,
        filter: true,
        fixedSearch: false,
        search: true,
        download: false,
        viewColumns: true,
        fixedHeader: true,
        elevation: 4,
        responsive: 'scroll',
        filterValues: true
    }
};
```

## **Default Context**

```typescript
export const DEFAULT_CONTEXT: MUITableContext = {
    options: DEFAULT_OPTS,
    columns: [],
    rows: [],
    displayRows: [],
    columnFilters: [],
    selectedRows: [],
    search: {
        open: false,
        text: null
    },
    viewColumns: [],
    sortColumn: {
        index: null,
        asc: false
    },
    pagination: {
        page: 0,
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 15]
    },
    toggleViewColumn: (index: number) => {},
    searchTextUpdate: (text: string | null) => {},
    toggleSearchVisible: () => {},
    onFilterUpdate: (colIndex: number, value: string) => {},
    onFilterReset: () => {},
    onRowsDelete: () => {},
    toggleRowSelected: row => {},
    handleAllSelect: () => {},
    toggleSort: (colIndex: number) => {},
    changePage: (p: number) => {},
    changeRowsPerPage: (p: number) => {},
    getFilterData: (column: StateColumn<any>) => [],
    getVisibleColumns: () => []
};
```

## **Default Column**

```typescript
export const DEFAULT_COL: StateColumn = {
    name: 'column',
    title: 'Column',
    type: 'dimension',
    display: 'true',
    isRowId: true,
    calculateCellDefinition: entry => ({ display: '', value: '' }),
    summary: false,
    filter: true,
    filterOptions: {
        type: 'multiselect',
        exact: false
    } as FilterOpts,
    sort: true,
    download: true,
    viewColumns: true
};
```

