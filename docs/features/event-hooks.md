# Event Hooks

Allows you to link into internal table actions and perform side effects.

```typescript
export interface HookOptions {
    // Search text change
    onSearchChange?: (searchText: string) => void;
    // Row selection change
    onRowsSelect?: (
        newSelections: Row[],
        removedSelections: Row[],
        currentSelections: Row[]
    ) => void;
    // Delete button pressed with rows selected. 
    // Does nothing in internal table state, the rows will still 
    // be there unless removed from the data prop
    onRowsDelete?: (rowsDeleted: Row<R>[]) => void;
    onFilterChange?: (change: string | string[], filterList: string[][]) => void;
    onRowClick?: (row: Row<R>, rowIndex: number) => void;
    onCellClick?: (cell: Cell<any>, row: Row<any>, rowIndex: number) => void;
    onColumnSortChange?: (changedColumn: StateColumn<any>, direction: string | null) => void;
    onColumnViewChange?: (changedColumn: StateColumn<any>, visible: boolean) => void;
    onChangePage?: (currentPage: number) => void;
    onChangeRowsPerPage?: (numberOfRows: number) => void;
}
```

