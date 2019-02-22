import get from 'lodash.get';
import has from 'lodash.has';
import {
    Cell,
    GeneratedColumn,
    MUIDataObj,
    Options,
    ParentProps,
    ColumnProp,
    Row,
    State,
    StateColumn,
    SummaryFormats,
    SummaryRowCell
} from '../types';
import { DEFAULT_COL, DEFAULT_OPTS } from './index';

export default class MUITableUtils {
    static formatSeconds = (secs: number) => {
        const hours = secs / 3600;
        const hoursDisplay = (hours - (hours % 1)).toFixed(0);
        const minutes = (secs / 60) % 60;
        const minDisplay = (minutes / 10 >= 1 ? '' : '0') + Math.floor(minutes);
        return `${hoursDisplay}:${minDisplay}`;
    };

    static formatValue = (value: number, format: SummaryFormats = 'float') => {
        switch (format) {
            case 'float':
                return value.toFixed(2);
            case 'integer':
                return value.toFixed(0);
            case 'seconds':
                return MUITableUtils.formatSeconds(value);
            case 'minutes':
                return MUITableUtils.formatSeconds(value * 60);
            case 'hours':
                return MUITableUtils.formatSeconds(value * 60 * 60);
        }
    };

    static formatColumnValue = (value: number, column?: StateColumn<any>) => {
        const formatType = column && column.summaryOptions ? column.summaryOptions.format : 'float';
        let result = MUITableUtils.formatValue(value, formatType);
        if (column && column.summaryOptions) {
            if (column.summaryOptions.postfix) {
                result += column.summaryOptions.postfix;
            }
            if (column.summaryOptions.prefix) {
                result = column.summaryOptions.prefix + result;
            }
        }
        return result;
    };

    static sumColumnCell = (value: number, cell: Cell<any>) => {
        if (cell && cell.value) {
            return value + Number(cell.value);
        }
        return value;
    };

    static validateCustomSummaryCell = (cell: SummaryRowCell) => {
        const errorMessages: string[] = [];
        if (typeof cell !== 'object') {
            errorMessages.push(`Summary cell returned from custom calculation incorrectly 
            formatted. Expected object, was returned "${typeof cell}"`);
        }
        const checkProps = [
            'total',
            'total.value',
            'total.display',
            'total.column',
            'visible',
            'visible.value',
            'visible.display',
            'visible.column'
        ];
        errorMessages.length === 0 &&
            checkProps.forEach(prop => {
                if (!has(cell, prop)) {
                    errorMessages.push(
                        `Summary cell returned from custom 
                        calculation missing required prop ${prop}`
                    );
                }
            });
        if (errorMessages.length > 0) {
            console.error(errorMessages, cell);
            throw new Error(
                `Summary cell returned from custom calculation does not meet requirements`
            );
        }
    };

    static calculateSummaryRow = (
        displayRows: Row<any>[],
        allRows: Row<any>[],
        columns: StateColumn<any>[]
    ) => {
        return columns.reduce(
            (summary, column, colIndex) => {
                if (
                    column.summaryOptions &&
                    column.summaryOptions.customCalculate &&
                    column.summary
                ) {
                    try {
                        const customRow = column.summaryOptions.customCalculate(
                            displayRows,
                            allRows
                        );
                        MUITableUtils.validateCustomSummaryCell(customRow);
                        return [...summary, customRow];
                    } catch (e) {
                        console.error(e);
                        console.error(`^^ The above error occured in the 
                        summaryOptions.customCalculate function for the ${column.name} column. 
                        Using standard summary calculation..,`);
                    }
                }
                if (!column.summary || column.type === 'dimension') {
                    const nullCell = {
                        column,
                        value: null,
                        display: ''
                    };
                    const nullSummary: SummaryRowCell = { visible: nullCell, total: nullCell };
                    return [...summary, nullSummary];
                }
                let displayVal = displayRows
                    .map(r => r[colIndex])
                    .reduce(MUITableUtils.sumColumnCell, 0);

                let totalVal = allRows.map(r => r[colIndex]).reduce(MUITableUtils.sumColumnCell, 0);

                if (column.summaryOptions && column.summaryOptions.type === 'AVG') {
                    totalVal = totalVal / allRows.length;
                    displayVal = displayVal / displayRows.length;
                }

                const summaryCell: SummaryRowCell = {
                    visible: {
                        column,
                        display: MUITableUtils.formatColumnValue(displayVal, column),
                        value: displayVal
                    },
                    total: {
                        column,
                        display: MUITableUtils.formatColumnValue(totalVal, column),
                        value: totalVal
                    }
                };
                return [...summary, summaryCell];
            },
            [] as SummaryRowCell[]
        );
    };

    static sortRows = (rows: Row<any>[], tableState: State<any>, columns: StateColumn<any>[]) => {
        const colIndex = tableState.sortColumn.index;
        if (colIndex === null || colIndex < 0 || !columns[colIndex]) return rows;
        const direction = tableState.sortColumn.asc ? 'asc' : 'desc';
        const colTitle = columns[colIndex].name;
        const findCellIndex = (cell: Cell<any>) => {
            return cell.column.name === colTitle;
        };
        return rows.sort((a, b) => {
            const dir = direction === 'asc' ? 1 : -1;
            const aValue = a[a.findIndex(findCellIndex)];
            const bValue = b[b.findIndex(findCellIndex)];

            if (aValue && bValue) {
                const modifier =
                    typeof aValue.value.localeCompare === 'function'
                        ? aValue.value.localeCompare(bValue.value)
                        : Number(aValue.value) - Number(bValue.value);
                return modifier * dir;
            }
            return -1;
        });
    };

    static searchFilterOk = (row: Row<any>, tableState: State<any>) => {
        if (!tableState.search.text || !tableState.search.open) {
            return true;
        }
        const searchText = tableState.search.text.trim().toLowerCase();
        const rowText = row
            .map(c => c.display)
            .join(' ')
            .toLowerCase();
        return rowText.indexOf(searchText) >= 0;
    };

    static filterRows = (
        rows: Row<any>[],
        tableState: State<any>,
        options: Options<any>,
        columns: StateColumn<any>[]
    ) => {
        const filterColumns = tableState.columnFilters;
        if (!options.display.filter || filterColumns.length <= 0) {
            return rows;
        }
        return rows.reduce(
            (passed, row) => {
                const ok =
                    MUITableUtils.searchFilterOk(row, tableState) &&
                    filterColumns.reduce((ok, filterOptions, index) => {
                        const column = columns[index];
                        const cell = row[index];
                        if (!cell || !cell.display) {
                            return ok;
                        }
                        if (filterOptions.length <= 0) {
                            return ok;
                        }
                        if (column && column.filterOptions && column.filterOptions.exact) {
                            return filterOptions.indexOf(cell.display) >= 0 ? ok : false;
                        }
                        return (
                            ok &&
                            filterOptions.reduce(
                                (ok, val) => (cell.display.includes(val) ? true : ok),
                                false
                            )
                        );
                    }, true);
                return ok ? [...passed, row] : passed;
            },
            [] as Row<any>[]
        );
    };

    static findRowIndex = (row: Row<any>, rowIds: string[]) => {
        const rowId = MUITableUtils.rowId(row);
        return rowIds.findIndex(r => rowId === r);
    };

    static rowId = (row: Row<any>) => {
        const idVals: string[] = row.reduce(
            (idVals, cell) => {
                if (cell.column.isRowId) {
                    return [...idVals, cell.display];
                }
                return idVals;
            },
            [] as string[]
        );
        if (idVals.length <= 0) {
            return '-';
        }
        return idVals.join('-');
    };

    static buildRows = <R extends MUIDataObj = MUIDataObj>(
        data: R[],
        columns: StateColumn<any>[],
        options: Options<any>
    ) => {
        const rows = data.map(entry => {
            return columns.map(c => ({
                ...c.calculateCellDefinition(entry),
                column: c
            }));
        });
        if (options.rows.skipDuplicates) {
            return MUITableUtils.filterDuplicates(rows);
        }
        if (options.rows.mergeDuplicates) {
            return MUITableUtils.mergeDuplicates(rows, options);
        }
        return rows;
    };

    static buildOptions = (props: ParentProps<any>) => {
        const defaultOpts = DEFAULT_OPTS;
        const options: Options<any> = {
            title: props.title,
            loading: props.loading,
            display: {
                ...defaultOpts.display,
                ...props.display
            },
            toolbar: {
                ...defaultOpts.toolbar,
                ...props.toolbar
            },
            columns: {
                ...defaultOpts.columns,
                ...props.columns
            },
            rows: {
                ...defaultOpts.rows,
                ...props.rows
            },
            pagination: {
                ...defaultOpts.pagination,
                ...props.pagination
            },
            translations: {
                body: {
                    ...defaultOpts.translations.body,
                    ...(props.translations ? props.translations.body : {})
                },
                pagination: {
                    ...defaultOpts.translations.pagination,
                    ...(props.translations ? props.translations.pagination : {})
                },
                toolbar: {
                    ...defaultOpts.translations.toolbar,
                    ...(props.translations ? props.translations.toolbar : {})
                },
                filter: {
                    ...defaultOpts.translations.filter,
                    ...(props.translations ? props.translations.filter : {})
                },
                viewColumns: {
                    ...defaultOpts.translations.viewColumns,
                    ...(props.translations ? props.translations.viewColumns : {})
                },
                selectedRows: {
                    ...defaultOpts.translations.selectedRows,
                    ...(props.translations ? props.translations.selectedRows : {})
                }
            },
            hooks: {
                ...props.hooks
            }
        };
        return options;
    };

    static buildStaticColumns = (
        data: MUIDataObj[],
        staticCols: ColumnProp<any>[],
        generatedColumns?: GeneratedColumn<any>[]
    ) => {
        const defaultCol = DEFAULT_COL;
        const columns: StateColumn<any>[] = staticCols.map(s => ({
            ...defaultCol,
            isRowId: s.type === 'dimension',
            ...s
        }));
        return generatedColumns
            ? [...columns, ...MUITableUtils.buildGeneratedColumns(generatedColumns, data)]
            : columns;
    };

    static buildGeneratedColumns = (
        generatedColumns: GeneratedColumn<any>[],
        data: MUIDataObj[]
    ) => {
        return generatedColumns.reduce(
            (columns, dynamicCol) => {
                const columnSourceObjs = data.reduce(
                    (prev: MUIDataObj[], entry) => {
                        const rootObj = get(entry, dynamicCol.path, null);
                        if (
                            rootObj &&
                            rootObj.hasOwnProperty(dynamicCol.nameProp) &&
                            typeof rootObj[dynamicCol.nameProp] === 'string' &&
                            prev.indexOf(rootObj[dynamicCol.nameProp]) < 0
                        ) {
                            return [...prev, rootObj];
                        }
                        return prev;
                    },
                    [] as MUIDataObj[]
                );
                for (const entry of columnSourceObjs) {
                    const title = entry[dynamicCol.nameProp as string];
                    const name =
                        title
                            .toLowerCase()
                            .trim()
                            .replace(' ', '') + Math.random();

                    let newCol: StateColumn<any> = {
                        ...DEFAULT_COL,
                        name,
                        title,
                        type: dynamicCol.type,
                        ...dynamicCol.options
                    };

                    if (dynamicCol.modifyProps) {
                        try {
                            newCol = dynamicCol.modifyProps(newCol, entry);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    columns.push(newCol);
                    if (dynamicCol.generateRelatedColumns) {
                        try {
                            const genCols = dynamicCol.generateRelatedColumns(newCol, entry);
                            if (genCols && Array.isArray(genCols)) {
                                genCols.forEach(genCol =>
                                    columns.push({
                                        ...DEFAULT_COL,
                                        ...genCol
                                    })
                                );
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
                return columns;
            },
            [] as StateColumn<any>[]
        );
    };

    static getRowIds = (rows: Row<any>[]) => {
        return rows.map(r => MUITableUtils.rowId(r));
    };

    static filterDuplicates: (rows: Row<any>[]) => Row<any>[] = rows => {
        return rows.reduce(
            (prev, row) => {
                if (MUITableUtils.findRowIndex(row, MUITableUtils.getRowIds(prev)) < 0) {
                    return [...prev, row];
                }
                return prev;
            },
            [] as Row<any>[]
        );
    };

    static mergeDuplicates: (rows: Row<any>[], options: Options<any>) => Row<any>[] = (
        rows,
        options
    ) => {
        return rows.reduce(
            (prev, row) => {
                const prevIndex = MUITableUtils.findRowIndex(row, MUITableUtils.getRowIds(prev));
                const existingRow = prev[prevIndex];
                if (existingRow) {
                    if (options.rows.mergeFunction) {
                        try {
                            prev[prevIndex] = options.rows.mergeFunction([existingRow, row]);
                        } catch (e) {
                            console.error(
                                'Error thrown in the options.rows.mergeFunction provided, ' +
                                    'reverting to default',
                                e
                            );
                            prev[prevIndex] = MUITableUtils.mergeCellsCalc([existingRow, row]);
                        }
                    } else {
                        prev[prevIndex] = MUITableUtils.mergeCellsCalc([existingRow, row]);
                    }
                    return prev;
                }
                return [...prev, row];
            },
            [] as Row<any>[]
        );
    };

    static mergeForHiddenColumns = (
        rows: Row<any>[],
        options: Options<any>,
        viewColumns: boolean[]
    ) => {
        // If no columns are hidden or the option = false just return rows
        if (!options.rows.hiddenColumnMerge || viewColumns.indexOf(false) < 0) {
            return rows;
        }
        /**
         * Set isRowId = false for any columns that are hidden, since rowIds are calculated
         * based on cells where the column.isRowId = true
         */
        const newRows = rows.map(row =>
            row.map((cell, colIndex) => ({
                ...cell,
                column: {
                    ...cell.column,
                    isRowId: cell.column.isRowId && !!viewColumns[colIndex]
                }
            }))
        );
        return MUITableUtils.mergeDuplicates(newRows, options);
    };

    // Utility function, used for both mergeDuplicates and hiddenColumnsMergeDuplicates
    static mergeCellsCalc: (rows: Row<any>[]) => Row<any> = rows => {
        return rows.reduce(
            (finalRow, row) => {
                row.forEach((cell, cellIndex) => {
                    if (!finalRow[cellIndex]) {
                        finalRow[cellIndex] = cell;
                    } else if (cell.column.type === 'metric') {
                        const existingSummaryOpts = finalRow[cellIndex].column.summaryOptions;
                        const format = existingSummaryOpts ? existingSummaryOpts.format : 'float';
                        finalRow[cellIndex].value =
                            Number(finalRow[cellIndex].value) + Number(cell.value);
                        finalRow[cellIndex].display = MUITableUtils.formatValue(
                            finalRow[cellIndex].value,
                            format
                        );
                    }
                });
                return finalRow;
            },
            [] as Row<any>
        );
    };
}
