# ColumnOptions

## ColumnOptions

```jsx
const example = <MUITable {...props} columns={ColumnOptions} />
```

| Prop | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| static | `ColumnProp[]` | Column definitions | ✅ | n/a |
| generated | `GeneratedColumn[]` | Define columns generated from the data set | ❌ | `[]` |
| sortColumns | `(columns: StateColumn[]) => StateColumn[]` | Function to sort the order of the columns once generated. Especially useful with `GeneratedColumns` | ❌ | `[]` |

## ColumnProp

| Prop | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| name | `string` | Key for the column. | ✅ | n/a |
| calculateCellDefinition | `(item: Object) => Cell` | Takes an item from your data array prop and returns a Cell. | ✅ | n/a |
| title | `string` | Display this as column head text instead of `name` | ❌ | `undefined` |
| type | `"dimension" | "metric"` | Metric will treat Cell display values as numbers | ❌ | `"dimension"` |
| display | `'true' | 'false' | 'excluded'` | **true** will show column by default, **false** will hide by default \(can toggle with viewColumns\), **excluded** will never show the column | ❌ | `"true"` |
| isRowId | `boolean` | Use cell value for this column to create an unique row ID. Defaults to true if type is "dimension", false if "metric" | ❌ | `col.type === "dimension"` |
| summary | `boolean` | Show in summary row | ❌ | `false` |
| summaryOptions | `ColSummaryOpts` | See below. | ❌ | `undefined` |
| filter | `boolean` | Show in filter data tool. | ❌ | `true` |
| filterOptions | `ColFilterOpts` | See below. | ❌ | `undefined` |
| viewColumns | `boolean` | Show in toggle columns tool. | ❌ | `true` |
| sort | `boolean` | Sort data by column? | ❌ | `true` |
| download | `boolean` | Show column in csv download? | ❌ | `true` |
| customHeadRender | `(col: StateColumn) => ReactNode` | Custom head cell render. Learn more in custom components page. | ❌ | `undefined` |
| customBodyRender | `(cell: Cell, row: Cell[]) => ReactNode` | Custom body cell render. Learn more in custom components page. | ❌ | `undefined` |

### `ColSummaryOpts`

<table>
  <thead>
    <tr>
      <th style="text-align:left">Prop</th>
      <th style="text-align:left">Type</th>
      <th style="text-align:left">Description</th>
      <th style="text-align:left">Required</th>
      <th style="text-align:left">Default</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:left">type</td>
      <td style="text-align:left"><code>&apos;AVG&apos; | &apos;SUM&apos;</code>
      </td>
      <td style="text-align:left">How to calculate summary total</td>
      <td style="text-align:left">✅</td>
      <td style="text-align:left"><code>&apos;SUM&apos;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">format</td>
      <td style="text-align:left">
        <p><code>&apos;float&apos; | &apos;integer&apos; | </code>
        </p>
        <p><code>&apos;seconds&apos; | &apos;hours&apos; | &apos;minutes&apos;</code>
        </p>
      </td>
      <td style="text-align:left">Format for the summary values</td>
      <td style="text-align:left">✅</td>
      <td style="text-align:left"><code>&apos;float&apos;</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">prefix</td>
      <td style="text-align:left"><code>string</code>
      </td>
      <td style="text-align:left">Prefix for value in summary</td>
      <td style="text-align:left">❌</td>
      <td style="text-align:left"><code>undefined</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">postfix</td>
      <td style="text-align:left"><code>string</code>
      </td>
      <td style="text-align:left">Postfix for value in summary</td>
      <td style="text-align:left">❌</td>
      <td style="text-align:left"><code>undefined</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">customCalculate</td>
      <td style="text-align:left">
        <p><code>(displayRows: Row[], allRows: Row[]) =&gt; ({</code>
        </p>
        <p><code>visible: Cell, total: Cell })</code>
        </p>
      </td>
      <td style="text-align:left">Custom calculate function for summary cell</td>
      <td style="text-align:left">❌</td>
      <td style="text-align:left"><code>undefined</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">customRender</td>
      <td style="text-align:left"><code>({visible: Cell, total: Cell}) =&gt; ReactNode</code>
      </td>
      <td style="text-align:left">Custom render function for summary cell</td>
      <td style="text-align:left">❌</td>
      <td style="text-align:left"><code>undefined</code>
      </td>
    </tr>
    <tr>
      <td style="text-align:left">showComparison</td>
      <td style="text-align:left"><code>&apos;true&apos; | &apos;whenDifferent&apos; | &apos;false&apos;</code>
      </td>
      <td style="text-align:left">See below.</td>
      <td style="text-align:left">❌</td>
      <td style="text-align:left"><code>&apos;true&apos;</code>
      </td>
    </tr>
  </tbody>
</table>![Summary Row Example](../.gitbook/assets/image%20%283%29.png)

### `ColFilterOpts`

| Prop | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| exact | `boolean` | Filter using `.includes()` or exact | ✅ | `true` |
| type | `'checkbox' | 'dropdown' | 'multiselect'` | How to render filter picker | ✅ | `'multiselect'` |
| defaultOpts | `string[]` | Values to include even if not in data | ❌ | `undefined` |
| sortFilterList | `boolean` | Alphabetically sort the filter options? | ❌ | `false` |

## `GeneratedColumn`

| Prop | Type | Description | Required | Default |
| :--- | :--- | :--- | :--- | :--- |
| path | `string[]` | Path of object keys to follow to get root entry. | ✅ | n/a |
| nameProp | `string` | Key of the nested object to use for the column name. | ✅ | n/a |
| options | `ColumnProp` | Default options to user | ❌ | defaults from ColumnProp |
| type | `"dimension" | "metric"` | Metric will treat Cell display values as numbers. | ❌ | `"dimension"` |
| modifyProps | `(col: StateColumn, entry: Object) => StateColumn` | Take the generated StateColumn and modify any props. | ❌ | `undefined` |
| generateRelatedColumns | `( col: ColumnProp, entry: Object ) => ColumnProp[] | null;` | Generate more columns from the initial one generated | ❌ | `undefined` |





