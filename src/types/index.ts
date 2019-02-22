import { ReactNode } from 'react';

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

export type DisplayRow<R extends MUIDataObj = MUIDataObj> = {
    cells: Cell<R>[];
    rowId?: string;
    rowIds?: string[];
};

/////////////////////////// COLUMNS ///////////////////////////

type CalculateCell<R extends MUIDataObj> = (entry: R) => Omit<Cell<R>, 'column'>;

export type SummaryFormats = 'float' | 'integer' | 'seconds' | 'hours' | 'minutes';

type SummaryTypes = 'AVG' | 'SUM';

interface SummaryOpts {
    type: SummaryTypes;
    format: SummaryFormats;
    prefix?: string;
    postfix?: string;
    /**
     * Given the non-filtered rows and all rows (array of cells), return a calculation
     * of the visible and total cells
     */
    customCalculate?: (displayRows: Row<any>[], allRows: Row<any>[]) => SummaryRowCell;
    customRender?: (s: SummaryRowCell) => ReactNode;
    showComparison?: 'true' | 'whenDifferent' | 'false';
}

export interface SummaryRowCell {
    visible: Cell<any>;
    total: Cell<any>;
}

export type FilterTypes = 'checkbox' | 'dropdown' | 'multiselect';

export interface FilterOpts {
    exact: boolean;
    type: FilterTypes;
    defaultOpts?: string[];
    sortFilterList?: boolean;
}

type RequiredColProps = 'name' | 'calculateCellDefinition';

export interface ColumnProp<R extends MUIDataObj>
    extends OptionalExceptFor<StateColumn<R>, RequiredColProps> {}

type ColTypes = 'dimension' | 'metric';

export interface StateColumn<R extends MUIDataObj> {
    name: string;
    calculateCellDefinition: CalculateCell<R>;
    title?: string;
    type: ColTypes;

    display: 'true' | 'false' | 'excluded';

    // Use cell value for this column to create a unique rowId
    // defaults to true if dimension, false if metric
    isRowId: boolean;

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
    col: ColumnProp<R>,
    entry: R
) => ColumnProp<R>[] | null;

export interface GeneratedColumn<R extends MUIDataObj> {
    path: string[];
    nameProp: keyof R;
    type: ColTypes;
    options: Optional<ColumnProp<R>>;
    modifyProps?: (col: StateColumn<R>, entry: R) => StateColumn<R>;
    generateRelatedColumns?: GenerateRelated<R>;
}

/////////////////////////// OPTIONS ///////////////////////////
interface RowOptions<R extends MUIDataObj> {
    rowHover: boolean;
    showSummaryRow: boolean;
    selectable: boolean;
    summaryTop: boolean;
    setRowProps?: (row: Row<R>, rowIndex: number) => { [k: string]: any };

    customToolbarSelect?: (selectedRows: Row<R>[], context: MUITableContext<any>) => ReactNode;
    selectBarTop?: boolean;
    selectBarActions?: (selectedRows: Row<R>[], context: MUITableContext<any>) => ReactNode;
    hideSelectDelete?: boolean;

    /**
     * @property {boolean = false} skipDuplicates
     *
     * If this is true, rows with all cell values matching will be only displayed once.
     *
     * IMPORTANT: Takes precedence over mergeDuplicates, so make sure skipDuplicates = false if
     * mergeDuplicates is the desired behavior
     *
     * Example if true:
     * rows = [ [parker, 11/1, 5], [parker, 11/1, 5] ]
     * displayRows = [ [parker, 11/1, 5] ]
     */
    skipDuplicates: boolean;

    /**
     * @property {boolean = false} mergeDuplicates
     *
     * If this is true, rows with duplicate dimensions will have their metric columns summed
     * instead of displaying twice.
     *
     * IMPORTANT: skipDuplicates takes precedence over mergeDuplicates, so make sure
     * skipDuplicates = false if mergeDuplicates is the desired behavior
     *
     * Example if true:
     * rows = [ [parker, 11/1, 5], [parker, 11/1, 5] ]
     * displayRows = [ [parker, 11/1, 10] ]
     */
    mergeDuplicates: boolean;

    /**
     * Used for both mergeDuplicates and hiddenColumnMerge
     * If not provided, each cell in a metric column is summed.
     * @param cells {Row[]}
     */
    mergeFunction?: (rows: Row<any>[]) => Row<any>;

    /**
     * @property {boolean = false} mergeHidden
     *
     * If this is true, rows with duplicate dimensions when columns are hidden
     * will have their metric columns summed instead of displaying twice.
     *
     * Example if true:
     *  columnsVisible = [true, false, true]
     *  rows = [ [parker, 11/1, 5], [parker, 11/3, 5]
     *  displayRows = [parker, null, 10]
     */
    hiddenColumnMerge: boolean;
}

type SortColumns<R extends MUIDataObj> = (cols: StateColumn<R>[]) => StateColumn<R>[];

interface ColumnOptions<R extends MUIDataObj> {
    static: ColumnProp<R>[];
    generated?: GeneratedColumn<R>[];
    sortColumns?: SortColumns<R>;
}

export interface ToolbarOptions<R extends MUIDataObj> {
    showDates: boolean;
    startDate?: Date;
    endDate?: Date;
    handleDateChange?: (isStart: boolean) => (value: any) => void;
    startLabel?: string;
    endLabel?: string;
    customToolbarRight?: (context: MUITableContext) => ReactNode;
    customToolbarLeft?: (context: MUITableContext) => ReactNode;
    customToolbarBottom?: (context: MUITableContext) => ReactNode;
    customToolbarFull?: (context: MUITableContext) => ReactNode;
}

export interface HookOptions<R extends MUIDataObj> {
    onSearchChange?: (searchText: string) => void;
    onRowsSelect?: (
        newSelections: Row<R>[],
        removedSelections: Row<R>[],
        currentSelections: Row<R>[]
    ) => void;
    onRowsDelete?: (rowsDeleted: Row<R>[]) => void;
    onFilterChange?: (change: string | string[], filterList: string[][]) => void;
    onRowClick?: (row: Row<R>, rowIndex: number) => void;
    onCellClick?: (cell: Cell<any>, row: Row<any>, rowIndex: number) => void;
    onColumnSortChange?: (changedColumn: StateColumn<any>, direction: string | null) => void;
    onColumnViewChange?: (changedColumn: StateColumn<any>, visible: boolean) => void;
    onChangePage?: (currentPage: number) => void;
    onChangeRowsPerPage?: (numberOfRows: number) => void;
}

interface PaginationOptions {
    page?: number;
    rowsPerPage?: number;
    rowsPerPageOptions?: number[];
    customFooter?: (context: MUITableContext) => ReactNode;
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
        first: string;
        last: string;
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
    fixedSearch: boolean;
    search: boolean;
    download: boolean;
    fixedHeader: boolean;
    viewColumns: boolean;
    elevation: number;
    responsive: 'stacked' | 'scroll';
    filterValues: boolean;
}

export interface UserOptions<R extends MUIDataObj> {
    title: ReactNode;
    loading?: boolean;

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

export interface MUITableContext<R extends MUIDataObj = MUIDataObj>
    extends State<R>,
        ContextActions<R> {
    options: Options<R>;
    rows: Row<R>[];
    displayRows: Row<R>[];
    columns: StateColumn<R>[];
}
