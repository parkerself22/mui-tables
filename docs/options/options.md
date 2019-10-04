# Top Level Props

## MUITable Props

The ****[**configurable example**](https://parkerself22.github.io/mui-tables/)  is a great way to see all of the options in action.

```jsx
<MUITable 
    title="Test"
    data={[]}
    loading={false}
    columns={ColumnOptions}
    toolbar={ToolbarOptions}
    rows={RowOptions}
    pagination={PaginationOptions}
    translations={TranslationOptions}
    hooks={HookOptions}
    display={DisplayOptions}
/>    
    
```

| Prop | Type | Required | Default |
| :--- | :--- | :--- | :--- |
| title | `ReactNode` | ✅ | n/a |
| data | `Object[]` | ✅ | n/a |
| loading | `boolean` | ❌ | `false` |
| [columns](options.md#columnoptions) | `ColumnOptions` | ✅ | n/a |
| [display](options.md#displayoptions) | `DisplayOptions` | ❌ | `DisplayOptionsDefault` |
| [toolbar](options.md#toolbaroptions) | `ToolbarOptions` | ❌ | `ToolbarOptionsDefault` |
| [rows](options.md#rowoptions) | `RowOptions` | ❌ | `RowOptionsDefault` |
| [pagination](options.md#paginationoptions) | `PaginationOptions` | ❌ | `PaginationOptionsDefault` |
| [translations](translationoptions.md) | `TranslationOptions` | ❌ | `TranslationOptionsDefault` |
| [hooks](options.md#hookoptions) | `HookOptions` | ❌ | `HookOptionsDefault` |

## `ColumnOptions`

[Expanded in Column Options page](column-options.md)

| Prop | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| [static](column-options.md#columnprop) | `ColumnProp[]` | Column definitions | ✅ | n/a |
| [generated](column-options.md#generatedcolumn) | `GeneratedColumn[]` | Define columns generated from the data set | ❌ | `[]` |
| sortColumns | `(columns: StateColumn[]) => StateColumn[]` | Function to sort the order of the columns once generated. Especially useful with `GeneratedColumns` | ❌ | `[]` |

## `DisplayOptions`

**None of these are required.**   
These are all of the highest level functionality options

<table>
  <thead>
    <tr>
      <th style="text-align:left">Prop</th>
      <th style="text-align:left">Type</th>
      <th style="text-align:left">Description</th>
      <th style="text-align:left">Default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left"><a href="column-options.md#columnprop">s</a>ort</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Allow sorting</td>
      <td style="text-align:left"><code>true</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">paginate</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Pagination footer</td>
      <td style="text-align:left"><code>true</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">filter</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Filter toolbar</td>
      <td style="text-align:left"><code>true</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">fixedSearch</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Fixed search bar under title</td>
      <td style="text-align:left"><code>false</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">search</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Button to toggle search bar</td>
      <td style="text-align:left"><code>true</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">download</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Download button</td>
      <td style="text-align:left"><code>false</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">fixedHeader</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Fixed column headers</td>
      <td style="text-align:left"><code>true</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">viewColumns</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Ability to toggle column visibility</td>
      <td style="text-align:left"><code>true</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">elevation</td>
      <td style="text-align:left"><code>number</code>
      </td>
      <td style="text-align:left">Paper elevation for entire table</td>
      <td style="text-align:left"><code>4</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">responsive</td>
      <td style="text-align:left">
        <p><code>&quot;stacked&quot; |</code>
        </p>
        <p><code>&quot;scroll&quot;</code>
        </p>
      </td>
      <td style="text-align:left">Wrap or horizontal scroll overflow</td>
      <td style="text-align:left"><code>&apos;scroll&apos;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">filterValues</td>
      <td style="text-align:left"><code>boolean</code>
      </td>
      <td style="text-align:left">Show current filters as chips under top toolbar</td>
      <td style="text-align:left"><code>true</code>
      </td>
    </tr>
  </tbody>
</table>## `ToolbarOptions`

| Prop | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| showDates | `boolean` | Show the date toolbar? | ✅ | `false` |
| startDate | `Date` | If `showDates` and not provided, start date picker won't render | ❌ | `undefined` |
| endDate | `Date` | If `showDates` and not provided, end date picker won't render | ❌ | `undefined` |
| handleDateChange | `(isStart: boolean) => (value: Date) => void` | Called first with `isStart`, and should return change handler. | `showDates === true` | n/a |
| startLabel | `string` | Label for start date picker | ❌ | `"Start Date"` |
| endLabel | `string` | Label for end date picker | ❌ | `"End Date"` |
| customToolbarRight | `(context: MUITableContext) => ReactNode` | [See Custom Components.](../features/custom-components.md) | ❌ | `undefined` |
| customToolbarLeft | `(context: MUITableContext) => ReactNode` | [See Custom Components.](../features/custom-components.md) | ❌ | `undefined` |
| customToolbarBottom | `(context: MUITableContext) => ReactNode` | [See Custom Components.](../features/custom-components.md) | ❌ | `undefined` |
| customToolbarFull | `(context: MUITableContext) => ReactNode` | [See Custom Components.](../features/custom-components.md) | ❌ | `undefined` |

## `RowOptions`

None of these are required.

| Prop | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| rowHover | `boolean` | Shade rows on hover | `false` |
| showSummaryRow | `boolean` | Show summary row | `false` |
| selectable | `boolean` | Selectable rows? | `false` |
| summaryTop | `boolean` | Show summary at top? | `true` |
| setRowProps | `(row: Row, rowIndex: number) => Object` | Set props on the standard MUI TableRow component | `undefined` |
| customToolbarSelect | `(selectedRows: Row[], context: MUITableContext) => ReactNode` | Render a custom toolbar when rows selected | `"End Date"` |
| selectBarTop | `boolean` | Show the selected rows toolbar in top of table | `true` |
| selectBarActions | `(context: MUITableContext) => ReactNode` | [See Custom Components.](../features/custom-components.md) | `undefined` |
| hideSelectDelete | `boolean` | Hide the default delete button in selected toolbar | `false` |
| skipDuplicates | `boolean` | See Row Merging / Duplication | `false` |
| mergeDuplicates | `boolean` | See Row Merging / Duplication | `false` |
| mergeFunction | `(rows: Row[]) => Row` | See Row Merging / Duplication | `undefined` |
| hiddenColumnMerge | `boolean` | See Row Merging / Duplication | `false` |

## `PaginationOptions`

None of these are required.

| Prop | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| page | `number` | Initial page. Will not affect subsequent renders if changed. | `0` |
| rowsPerPage | `boolean` | Initial rowsPerPage. Will not affect subsequent renders if changed. | `5` |
| rowsPerPageOptions | `number[]` | Choices for rowsPerPage | `[5,25,50]` |
| customFooter | `(context: MUITableContext) => ReactNode` | Render a custom footer instead of pagination. | `undefined` |

## `TranslationOptions`

[See the TranslationOptions page for all the text labels.](translationoptions.md)

## `HookOptions`

None of these are required.

```typescript
{
    onSearchChange?: (searchText: string) => void;
    onRowsSelect?: (
        newSelections: Row[],
        removedSelections: Row[],
        currentSelections: Row[]
    ) => void;
    onRowsDelete?: (rowsDeleted: Row[]) => void;
    onFilterChange?: (change: string | string[], filterList: string[][]) => void;
    onRowClick?: (row: Row, rowIndex: number) => void;
    onCellClick?: (cell: Cell, row: Row, rowIndex: number) => void;
    onColumnSortChange?: (changedColumn: StateColumn, direction: 'asc' | 'desc' | null) => void;
    onColumnViewChange?: (changedColumn: StateColumn, visible: boolean) => void;
    onChangePage?: (currentPage: number) => void;
    onChangeRowsPerPage?: (numberOfRows: number) => void;
}
```

