import { ReactNode } from "react";

/////////////////////////// UTILS ///////////////////////////

// Make all top-level props optional
export type Optional<T> = { [P in keyof T]?: T[P] };

// https://stackoverflow.com/questions/52703321/make-some-properties-optional-in-a-typescript-type
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>;

// Omit taken from https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type MUIDataObj = {
    [k: string]: any;
};

/////////////////////////// CELLS & ROWS ///////////////////////////

export interface Cell<R extends MUIDataObj> {
    value: any;
    display: string;
    column: StateColumn<R>;
}

export type Row<R extends MUIDataObj = MUIDataObj> = Cell<R>[];

/////////////////////////// COLUMNS ///////////////////////////

type CalculateCell<R extends MUIDataObj> = (entry: R) => Omit<Cell<R>, "column">;

export type SummaryFormats = "float" | "integer" | "seconds" | "hours" | "minutes";

type SummaryTypes = "AVG" | "SUM";

interface SummaryOpts {
    type: SummaryTypes;
    format: SummaryFormats;
    prefix?: string;
    postfix?: string;
    customCalculate?: (displayRows: Row<any>[], allRows: Row<any>[]) => SummaryRowCell;
    customRender?: (s: SummaryRowCell) => ReactNode;
    showComparison?: "true" | "whenDifferent" | "false"
}

export interface SummaryRowCell {
    visible: Cell<any>;
    total: Cell<any>;
}

export type FilterTypes = "checkbox" | "dropdown" | "multiselect";

interface FilterOpts {
    exact: boolean;
    type: FilterTypes;
    currentList: string[];
    options?: string[];
    sortFilterList?: boolean;
}

type RequiredColProps = "name" | "calculateCellDefinition";

export interface PropColumn<R extends MUIDataObj>
    extends OptionalExceptFor<StateColumn<R>, RequiredColProps> {}

type ColTypes = "dimension" | "metric";

export interface StateColumn<R extends MUIDataObj> {
    title?: string;
    name: string;
    type: ColTypes;
    display: "true" | "false" | "excluded";

    calculateCellDefinition: CalculateCell<R>;

    isRowId: boolean;

    cellJoinProps?: string[];

    summary: boolean;
    summaryOptions?: SummaryOpts;

    filter: boolean;
    filterOptions?: FilterOpts;

    viewColumns: boolean;

    sort: boolean;
    download: boolean;

    customHeadRender?: (col: StateColumn<R>) => ReactNode;
    customBodyRender?: (cell: Cell<R>, row: Row<any>) => ReactNode;
}

type GenerateRelated<R extends MUIDataObj> = (
    col: PropColumn<R>,
    entry: R
) => PropColumn<R>[] | null;

export interface GeneratedColumn<R extends MUIDataObj> {
    path: string[];
    nameProp: keyof R;
    type: ColTypes;
    options: Optional<PropColumn<R>>;
    modifyProps?: (col: StateColumn<R>, entry: R) => StateColumn<R>;
    generateRelatedColumns?: GenerateRelated<R>;
}

export const DEFAULT_COL: StateColumn<any> = {
    name: "column",
    title: "Column",
    type: "dimension",
    display: "true",
    isRowId: true,
    calculateCellDefinition: entry => ({ display: "", value: "" }),
    summary: false,
    filter: true,
    filterOptions: {
        type: "multiselect",
        exact: false,
        currentList: []
    },
    sort: true,
    download: true,
    viewColumns: true
};

/////////////////////////// OPTIONS ///////////////////////////
interface RowOptions<R extends MUIDataObj> {
    rowHover: boolean;
    showSummaryRow: boolean;
    selectable: boolean;
    summaryTop: boolean;
    setRowProps?: (row: Row<R>, rowIndex: number) => { [k: string]: any };
    customToolbarSelect?: (selectedRows: Row<R>[]) => ReactNode;
    joinProps?: string[]; // column names that are ok to merge rows with when columns hidden
}

type SortColumns<R extends MUIDataObj> = (cols: StateColumn<R>[]) => StateColumn<R>[];

interface ColumnOptions<R extends MUIDataObj> {
    static: PropColumn<R>[];
    generated?: GeneratedColumn<R>[];
    sortColumns?: SortColumns<R>;
}

interface ToolbarOptions<R extends MUIDataObj> {
    showDates: boolean;
    startDate?: Date;
    endDate?: Date;
    startLabel?: string;
    endLabel?: string;
    handleDateChange?: (isStart: boolean) => (value: any) => void;
    customToolbar?: () => ReactNode;
}

interface HookOptions<R extends MUIDataObj> {
    onDataChange?: (columns: StateColumn<R>[], rows: Row<R>[]) => void;
    onSearchChange?: (searchText: string) => void;
    onFilterChange?: (change: string | string[], filterList: string[][]) => void;
    onColumnSortChange?: (changedColumn: string, direction: string) => void;
    onColumnViewChange?: (changedColumn: string, action: string) => void;
    onRowsSelect?: (currentRowsSelected: Row<R>[], rowsSelected: any[]) => void;
    onRowsDelete?: (rowsDeleted: Row<R>[]) => void;
    onRowClick?: (row: Row<R>, rowIndex: number) => void;
    onCellClick?: (cell: Cell<any>, row: Row<any>, rowIndex: number) => void;
    onTableChange?: (action: string, tableState: State<R>) => void;
}

interface PaginationOptions {
    page?: number;
    count?: number;
    rowsPerPage?: number;
    rowsPerPageOptions?: number[];
    customFooter?: (
        count: number,
        page: number,
        rowsPerPage: number,
        changeRowsPerPage: (number: any) => void,
        changePage: (number: any) => void
    ) => ReactNode;
    onChangePage?: (currentPage: number) => void;
    onChangeRowsPerPage?: (numberOfRows: number) => void;
}

interface TranslationOptions {
    body: {
        noMatch: string;
        toolTip: string;
        summary: string;
    };
    pagination: {
        next: string;
        previous: string;
        rowsPerPage: string;
        displayRows: string;
    };
    toolbar: {
        search: string;
        downloadCsv: string;
        print: string;
        viewColumns: string;
        filterTable: string;
    };
    filter: {
        all: string;
        title: string;
        reset: string;
    };
    viewColumns: {
        title: string;
        titleAria: string;
    };
    selectedRows: {
        text: string;
        delete: string;
        deleteAria: string;
    };
}

interface DisplayOptions {
    sort: boolean;
    paginate: boolean;
    filter: boolean;
    search: boolean;
    print: boolean;
    download: boolean;
    fixedHeader: boolean;
    viewColumns: boolean;
    elevation: number;
    responsive: "stacked" | "scroll";
    filterValues: boolean;
}

export interface UserOptions<R extends MUIDataObj> {
    title: string;
    loading: boolean;

    columns: ColumnOptions<R>;

    toolbar?: ToolbarOptions<R>;

    rows?: Optional<RowOptions<R>>;

    pagination?: PaginationOptions;

    translations?: Optional<TranslationOptions>;

    hooks?: HookOptions<R>;

    display?: Optional<DisplayOptions>;
}

export interface Options<R extends MUIDataObj> extends UserOptions<R> {
    columns: ColumnOptions<R>;

    toolbar: ToolbarOptions<R>;

    rows: RowOptions<R>;

    pagination: PaginationOptions;

    translations: TranslationOptions;

    hooks?: HookOptions<R>;

    display: DisplayOptions;
}

export const DEFAULT_OPTS: Options<any> = {
    title: "Table",
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
        selectable: false
    },
    pagination: {
        rowsPerPage: 5,
        rowsPerPageOptions: [10, 25, 50]
    },
    translations: {
        body: {
            noMatch: "Sorry, no matching records found",
            toolTip: "Sort",
            summary: "SUMMARY"
        },
        pagination: {
            next: "Next Page",
            previous: "Previous Page",
            rowsPerPage: "Rows per page:",
            displayRows: "of"
        },
        toolbar: {
            search: "Search",
            downloadCsv: "Download CSV",
            print: "Print",
            viewColumns: "View Columns",
            filterTable: "Filter Table"
        },
        filter: {
            all: "All",
            title: "FILTERS",
            reset: "RESET"
        },
        viewColumns: {
            title: "Show Columns",
            titleAria: "Show/Hide Table Columns"
        },
        selectedRows: {
            text: "row(s) selected",
            delete: "Delete",
            deleteAria: "Delete Selected Rows"
        }
    },
    display: {
        sort: true,
        paginate: true,
        filter: true,
        search: true,
        print: false,
        download: false,
        viewColumns: true,
        fixedHeader: true,
        elevation: 4,
        responsive: "scroll",
        filterValues: true
    }
};

/////////////////////////// PROPS ///////////////////////////
export interface ParentProps<R extends MUIDataObj = MUIDataObj> extends UserOptions<R> {
    data: R[];
}

export interface State<R extends MUIDataObj = MUIDataObj> {
    selectedRows: string[];
    search: {
        text: string | null;
        open: boolean;
    };
    columnFilters: string[][];
    viewColumns: boolean[];
    sortColumn: {
        index: null | number;
        asc: boolean;
    };
    pagination: {
        page: number;
        rowsPerPage: number;
        rowsPerPageOptions: number[];
    };
}

export interface Props<R extends MUIDataObj = MUIDataObj> {
    options: Options<R>;
    rows: Row[];
    columns: StateColumn<R>[];
    data: R[];
}

export interface ContextActions<R extends MUIDataObj = MUIDataObj> {
    toggleViewColumn: (index: number) => void;
    searchTextUpdate: (text: string | null) => void;
    toggleSearchVisible: () => void;
    onFilterUpdate: (colIndex: number, value: string) => void;
    onFilterReset: () => void;
    onRowsDelete: () => void;
    toggleRowSelected: (row: Row<R>) => void;
    handleAllSelect: () => void;
    toggleSort: (colIndex: number) => void;
    changePage: (p: number) => void;
    changeRowsPerPage: (p: number) => void;
    getFilterData: (column: StateColumn<R>) => string[];
    getVisibleColumns: () => StateColumn<R>[];
}

export interface Context<R extends MUIDataObj = MUIDataObj> extends State<R>, ContextActions<R> {
    options: Options<R>;
    rows: Row<R>[];
    displayRows: Row<R>[];
    columns: StateColumn<R>[];
}

export const DEFAULT_CONTEXT: Context = {
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
