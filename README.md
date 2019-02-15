# Overview \| MUI Tables

[![Build Status](https://travis-ci.org/parkerself22/mui-table.svg?branch=master)](https://travis-ci.org/parkerself22/mui-table) [![npm-version](https://img.shields.io/npm/v/mui-tables.svg?style=flat)](https://www.npmjs.com/package/mui-tables) [![codecov](https://codecov.io/gh/parkerself22/mui-table/branch/master/graph/badge.svg)](https://codecov.io/gh/parkerself22/mui-table)

MUI Tables is a highly-pluggable table library built on top of the fantastic [Material-UI component library](https://github.com/mui-org/material-ui). 

There are admittedly already multiple libraries doing the same thing, but few \(in my opinion\) that provide as much abstraction on top of the data management aspect of building and using tables. The goal for MUI Tables is to make data management as painless as possible.

\*\*\*\*\* This documentation is very much still a work in progress \*\*\*\*

![Example with Summary, Date Toolbar, Filters, ](.gitbook/assets/image%20%285%29.png)

## Installation

```bash
npm i --save mui-tables
```

#### Peer Dependencies:

{% code-tabs %}
{% code-tabs-item title="Peer Dependencies" %}
```javascript
{
    "@material-ui/core": ">= 3.9.0",
    "@material-ui/icons": ">= 3.0.0",
    "react": ">= 16.8.1"
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Example Usage

![Intro Example](.gitbook/assets/image%20%281%29.png)

{% code-tabs %}
{% code-tabs-item title="intro.js" %}
```jsx
import React from 'react';
import MUITable from 'mui-tables';

const data = [
    { name: 'Bob', demographics: { age: 29, gender: "male" } },
    { name: 'Alice', demographics: { age: 34, gender: "female" } }
];

const columns = {
    static: [
        {
            name: 'name',
            title: 'Name',
            calculateCellDefinition: (entry) => ({
                display: entry.name,
                value: entry.name
            })
        },
        {
            name: 'age',
            title: 'Age',
            calculateCellDefinition: (entry) => ({
                // Never ask a woman's age fool!
                display: entry.demographics.gender === "female" ? "❓" : entry.demographics.age,
                value: entry.demographics.age
            })
        }
    ]
};

export const IntroExample = () => (
    <MUITable data={data} title={'Intro Table'} columns={columns} loading={false} />
);
```
{% endcode-tabs-item %}
{% endcode-tabs %}

## Props / Options

There are a lot of options here but the only required ones are title, loading, data, and the column definitions \(see example above\).

```typescript
/****** NOTATION ******/
// Optional properties are denoted as: (typescript)
prop?: ~type~
// If there's a default they are appended with: (not typescript)
prop?: ~type~ = value
```

### Props

```typescript
interface Props {
    title: string;
    loading: boolean;
    data: Object[];
    columns: {
        static: Column[];
        // Dynamic column definitions (columns generated from dataset, see Examples @todo)
        dynamic?: DynamicColumn[];
        // Function to sort columns (mostly useful for after DynamicColumns are generated)
        sortColumns?: (Columns[]) => Columns[];
    };
    // High level display options
    display?: {
        sort?: boolean = true; // Enable / disable across all columns
        paginate?: boolean = true;
        filter?: boolean = true; // Enable / disable across all columns
        search?: boolean = true; // Enable search toolbar
        print?: boolean = false; // Enable print button
        download?: boolean = false; // Enable download button
        fixedHeader?: boolean = true; // Column headers fixed
        viewColumns?: boolean = true; // Enable toggling columns
        elevation?: number = 4; // For root Paper element
        responsive?: 'stacked' | 'scroll' = 'scroll'; // Enable horizontal scrolling for overflow
        filterValues?: boolean = true; // Show current active filters at Chip elements at top of table
    };
    // Toolbar options
    toolbar?: {
        showDates: boolean; // Show date pickers
        startDate?: Date; // Required if showDates: true
        endDate?: Date; // Required if showDates: true
        startLabel?: string = "Start Date"; // Label for start date select
        endLabel?: string = "End Date"; // Label for end date select
        // Handler function for date changes
        handleDateChange?: (isStart: boolean) => (value: any) => void;
        // Custom toolbar element to render
        customToolbar?: () => ReactNode;
    }
    // Row options
    rows?: {
        rowHover?: boolean = false; // Enable hover styles for rows
        showSummaryRow?: boolean = false; // Show the summary row
        summaryTop?: boolean = false; // Display the summary as first row (default
        selectable?: boolean = false; // Allow individual row select
        // Set custom properties on row elements
        setRowProps?: (row: Row, rowIndex: number) => { [k: string]: any };
        // Custom element to render when rows selected
        customToolbarSelect?: (selectedRows: Row[]) => ReactNode;
        joinProps?: string[]; // Column names that are ok to merge rows with when columns hidden
    }
    // Pagination options
    pagination?: {
        page?: number = 0; // Initial page.
        rowsPerPage?: number; // Initial rows per page
        rowsPerPageOptions?: number[]; // Options for rows per page
        // Render custom footer elements
        customFooter?: (context: MUITableContext) => ReactNode;
        // Event handlers
        onChangePage?: (currentPage: number) => void;
        onChangeRowsPerPage?: (numberOfRows: number) => void;
    };

    translations?: TranslationOptions; // See below
    
    hooks?: HookOptions;
}
```

### Column Options

```typescript
// ?: Denotes optional properties
type Column = {
    name: string; // Unique name for the column.
    title?: string; // Title display if different from name
    type: 'dimension' | 'metric'; // Should cell values be treated like strings or numbers?
    display: 'true' | 'false' | 'excluded'; // use excluded for columns where you want the data in state but never displayed

    /**
    * Given an entry from the data array provided, 
    * calculate the cell to display for this column
    */
    calculateCellDefinition: (entry: Object) => ({
        value: any;
        display: string;
    })
    // Whether or not to use the value of the cell for this column in the rows unique ID
    isRowId: boolean;
    // Show column in summary row?
    summary: boolean; 
    summaryOptions?: {
        // How to calculate the summary
        type: 'AVG' | 'SUM';
        // all time options will format the summary into HH:MM format. 
        format: 'float' | 'integer' | 'seconds' | 'hours' | 'minutes';
        // Strings to prepend / append to the summarized value, respectfully
        prefix?: string;
        postfix?: string;
         /**
         * Given the non-filtered rows and all rows (array of cells), return a calculation
         * of the visible and total cells
         */
        customCalculate?: (displayRows: Row[], allRows: Row[]) => {
            visible: Cell;
            total: Cell;
        };
        // Custom render the summary.
        customRender?: (summary: {visible: Cell, total: Cell}) => ReactNode;
        // When not using a customRender function
        showComparison?: 'true' | 'whenDifferent' | 'false';
    }
    // Allow users to filter table by this column
    filter: boolean;
    filterOptions?: {
        // Compare using cellValue === filterValue vs cellValue.includes(filterValue)
        exact: boolean;
        // Element to render for selecting filter values
        type: 'checkbox' | 'dropdown' | 'multiselect';
        // Default options that may or may not be present in data
        defaultOpts?: string[];
        // Sort the filter options in alphabetical order for display in the component
        sortFilterList?: boolean;
    }
    // Allow users to toggle column visibility
    viewColumns: boolean;
    // Allow users to sort rows by column cell values
    sort: boolean;
    // Include column in table download 
    download: boolean;
    // Custom render function for column head cell
    customHeadRender?: (col: Column) => ReactNode;
    // Custom render for column cells
    customBodyRender?: (cell: Cell, row: Row) => ReactNode;
}

/**
 * DynamicColumn definition, used to automatically create column(s) 
 * based on nested properties on objects in the data set. 
 * See Example Use Case below.
 */
type DynamicColumn {
    // Path to the nested object  
    path: string[];
    // Name of the property on the nested object to produce the nested column
    nameProp: "string";
    type: 'dimension' | 'metric';
    // Default options for the generated column.
    options: Optional<Column>; // all properties optional
    // Once 
    modifyProps?: (column: Column, entry: Object<any>) => Column;
    generateRelatedColumns?: (col: Column,entry: R) => Column | null;
}

/****** DynamicColumn Example Use Case ******/
const GeneratedColumnExampleData = [
    {
        user: "test1",
        timeWorked: 200,
        task: {
            name: "Write Code"
        }
    },
    {
        user: "test1",
        timeWorked: 250,
        task: {
            name: "Test Code"
        }
    },
    {
        user: "test2",
        timeWorked: 100,
        task: {
            name: "Write Code"
        }
    },
    {
        user: "test2",
        timeWorked: 1250,
        task: {
            name: "Test Code"
        }
    }
];
const GeneratedColumnExample: GeneratedColumn<any> = {
    path: ["task"],
    nameProp: "name",
    type: "dimension",
    options: {
        isRowId: true
    },
    modifyProps: (column, entry) => {
        column.name = entry.task.name;
        return column;
    }
};
```

## Built With

* [@material-ui](https://material-ui.com) - Component Library
* [material-ui-pickers](https://www.npmjs.com/package/material-ui-pickers) - Date Picker Components

## Contributing

Coming soon...

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the releases on this repository.

## Authors

* **Parker Self** - _Initial work_ 

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://gist.github.com/PurpleBooth/LICENSE.md) file for details

