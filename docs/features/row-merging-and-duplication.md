# Row Merging & Duplication

### Description

```typescript
{
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
```

### Examples

Coming soon!

