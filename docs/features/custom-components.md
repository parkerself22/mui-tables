# Custom Components

Custom components can be plugged into the table for a variety of elements.

| Element | Option  | Type |
| :--- | :--- | :--- |
| Column Header Cell | `Column.customHeadRender` | `(col: StateColumn) => ReactNode` |
| Column Body Cell | `Column.customBodyRender` | `(cell: Cell, row: Cell[]) => ReactNode` |
| Select Toolbar | `RowOptions.customToolbarSelect` | `(selectedRows: Row[], context: MUITableContext) => ReactNode` |
| Select Toolbar Actions \(Buttons\) | `RowOptions.selectBarActions` | `(selectedRows: Row[], context: MUITableContext) => ReactNode` |
| Toolbar Right | `ToolbarOptions.customToolbarRight` | `(context: MUITableContext) => ReactNode` |
| Toolbar Left | `ToolbarOptions.customToolbarLeft` | `(context: MUITableContext) => ReactNode` |
| Toolbar Bottom | `ToolbarOptions.customToolbarBottom` | `(context: MUITableContext) => ReactNode` |
| Toolbar Full | `ToolbarOptions.customToolbarFull` | `(context: MUITableContext) => ReactNode` |
| Footer | `PaginationOptions.customFooter` | `(context: MUITableContext) => ReactNode` |

### Component Locations

![Custom Render Locations](../.gitbook/assets/image%20%289%29.png)

![Custom Render Locations](../.gitbook/assets/image%20%288%29.png)

