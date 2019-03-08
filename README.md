# Overview \| MUI Tables

[![Travis \(.org\)](https://img.shields.io/travis/parkerself22/mui-tables.svg?logo=travis)](https://travis-ci.org/parkerself22/mui-tables) [![npm](https://img.shields.io/npm/v/mui-tables.svg?color=F94048&label=mui-tables&logo=npm) ](https://www.npmjs.com/package/mui-tables) [![codecov](https://codecov.io/gh/parkerself22/mui-table/branch/master/graph/badge.svg)](https://codecov.io/gh/parkerself22/mui-table) [![npm](https://img.shields.io/npm/dw/mui-tables.svg?logo=npm)](https://www.npmjs.com/package/mui-tables)

### [DOCUMENTATION SITE](https://parkerself.gitbook.io/mui-table/)

MUI Tables is a highly-pluggable table library built on top of the fantastic [Material-UI component library](https://github.com/mui-org/material-ui). 

While multiple libraries already provide many of the features included, few \(in my opinion\) provide as much abstraction on top of the data management aspect of building and using tables. The goal for MUI Tables is to make data management as painless as possible while providing as many customization options as possible.

### [**Play with the Configurable Demo here!**](https://s3.amazonaws.com/mui-table/index.html)

![Example with Summary, Date Toolbar, Filters, ](docs/.gitbook/assets/image%20%2810%29.png)

## Installation

```bash
npm i --save mui-tables
```

#### Peer Dependencies:

```javascript
{
    "@material-ui/core": ">= 3.9.0",
    "@material-ui/icons": ">= 3.0.0",
    "react": ">= 16.8.1"
}
```

## **Features**

| **Feature** | Description |
| :--- | :--- |
| [Custom Components](docs/features/custom-components.md) | Multiple options to hook into component rendering, all supplied with the full context of the table |
| [Event Hooks](docs/features/event-hooks.md) | Hook into specific table events such as search and filter changes, row selection, and more |
| Summary Row | No config required summary row with two formats, more on the way. |
| [Automatic Duplicate Handling](docs/features/row-merging-and-duplication.md) | Specify whether duplicate rows should be displayed, merged, or hidden. |
| Built In Date Toolbar | No custom toolbar required, just specify change handlers and date values. |
| Localization | Full control over almost every text label. |
| Typescript Support | Typings included. Never guess what data you're hooks will be passed. |
| Styling | Override styles using MUIThemeProvider. |

## Example Usage

![Intro Example](docs/.gitbook/assets/image%20%287%29.png)

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

## Props / Options

[See Here](docs/options/options.md)

## Built With

* [@material-ui](https://material-ui.com) - Component Library
* [material-ui-pickers](https://www.npmjs.com/package/material-ui-pickers) - Date Picker Components

## Contributing

Coming soon...

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, [see the releases on this repository](https://github.com/parkerself22/mui-tables/releases).

## Authors

* [**Parker Self**](https://github.com/parkerself22) - _Initial work_ 

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/parkerself22/mui-tables/blob/master/LICENSE) file for details

