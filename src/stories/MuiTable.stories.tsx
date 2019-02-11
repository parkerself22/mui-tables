import { boolean, object, text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import React from 'react';
import { MUITable } from '../components/MUITable';
import MUITableUtils from '../constants/MUITableUtils';
import { PropColumn, UserOptions } from '../types/index';

storiesOf('MUITable', module).add(
    'example',
    () => {
        const EXAMPLE_DATA = [
            object(
                'row1',
                {
                    string: 'test',
                    number: 1,
                    seconds: 110,
                    date: '1/1/2018',
                    user: 'parker@go2impact.com'
                },
                'Data'
            ),
            object(
                'row2',
                {
                    string: 'test2',
                    number: 2,
                    seconds: 111,
                    date: '1/2/2018',
                    user: 'scott@go2impact.com'
                },
                'Data'
            ),
            object(
                'row3',
                {
                    string: 'test3',
                    number: 3,
                    seconds: 5000,
                    date: '1/3/2018',
                    user: 'alex@go2impact.com'
                },
                'Data'
            ),
            {
                string: 'test4',
                number: 4,
                seconds: 2000,
                date: '1/4/2018',
                user: 'parker@go2impact.com'
            },
            {
                string: 'test5',
                number: 5,
                seconds: 3601,
                date: '1/5/2018',
                user: 'scott@go2impact.com'
            },
            {
                string: 'test6',
                number: 6,
                seconds: 3602,
                date: '1/6/2018',
                user: 'alex@go2impact.com'
            },
            {
                string: 'tes7',
                number: 7,
                seconds: 3605,
                date: '1/7/2018',
                user: 'parker@go2impact.com'
            },
            {
                string: 'test8',
                number: 8,
                seconds: 3609,
                date: '1/8/2018',
                user: 'scott@go2impact.com'
            },
            {
                string: 'test9',
                number: 9,
                seconds: 3300,
                date: '1/9/2018',
                user: 'alex@go2impact.com'
            },
            {
                string: 'test10',
                number: 10,
                seconds: 3400,
                date: '1/10/2018',
                user: 'parker@go2impact.com'
            },
            {
                string: 'test11',
                number: 11,
                seconds: 3600,
                date: '1/11/2018',
                user: 'scott@go2impact.com'
            },
            {
                string: 'test12',
                number: 12,
                seconds: 3300,
                date: '1/12/2018',
                user: 'alex@go2impact.com'
            },
            {
                string: 'test13',
                number: 13,
                seconds: 32100,
                date: '1/13/2018',
                user: 'parker@go2impact.com'
            },
            {
                string: 'test14',
                number: 14,
                seconds: 32300,
                date: '1/14/2018',
                user: 'scott@go2impact.com'
            },
            {
                string: 'test15',
                number: 15,
                seconds: 600,
                date: '1/15/2018',
                user: 'alex@go2impact.com'
            }
        ];

        const columns: PropColumn<any>[] = [
            {
                name: 'string',
                title: text('Col1 Title', 'String', 'Static Columns'),
                type: 'dimension',
                calculateCellDefinition: entry => ({
                    value: entry.string,
                    display: entry.string
                }),
                summary: false,
                filterOptions: {
                    exact: false,
                    type: 'dropdown',
                    currentList: []
                }
            },
            {
                name: 'date',
                title: 'Date',
                type: 'metric',
                calculateCellDefinition: entry => ({
                    value: new Date(entry.number),
                    display: entry.date
                }),
                summary: false,
                sort: true
            },
            {
                name: 'user',
                title: 'User',
                type: 'dimension',
                calculateCellDefinition: entry => ({ value: entry.user, display: entry.user }),
                summary: false
            },
            {
                name: 'number2',
                title: 'AVG/Float Summary',
                type: 'metric',
                calculateCellDefinition: entry => ({
                    value: entry.number,
                    display: entry.number.toFixed(2)
                }),
                summary: true,
                summaryOptions: {
                    type: 'AVG',
                    format: 'float'
                },
                sort: true
            },
            {
                name: 'number',
                title: 'Sum/Int Summary',
                type: 'metric',
                calculateCellDefinition: entry => ({
                    value: entry.number,
                    display: entry.number.toFixed(0)
                }),
                summary: true,
                summaryOptions: {
                    type: 'SUM',
                    format: 'integer'
                },
                sort: true
            },
            {
                name: 'seconds',
                title: 'Time',
                type: 'metric',
                calculateCellDefinition: entry => ({
                    value: entry.seconds,
                    display: MUITableUtils.formatSeconds(entry.seconds)
                }),
                summaryOptions: {
                    type: 'AVG',
                    format: 'seconds'
                },
                summary: true,
                sort: true
            }
        ];

        const propsKnob: UserOptions<any> = {
            title: text('title', 'Table', 'Options'),
            loading: boolean('loading', false, 'Options'),
            columns: {
                static: columns,
                generated: []
            },
            toolbar: {
                showDates: boolean('showDates', false, 'Options.toolbar'),
                startDate: new Date(text('startDate', '2/1/18', 'Options.toolbar')),
                endDate: new Date(text('endDate', '2/1/18', 'Options.toolbar')),
                customToolbar: () => text('customToolbar (return value)', '', 'Options.toolbar'),
                handleDateChange: isStart => value => console.log(isStart, value)
            },
            rows: {
                rowHover: boolean('rowHover', false, 'Options.rows'),
                showSummaryRow: boolean('showSummaryRow', false, 'Options.rows'),
                summaryTop: boolean('summaryTop', false, 'Options.rows'),
                selectable: boolean('selectableRows', false, 'Options.rows')
            },
            pagination: {
                rowsPerPage: 3,
                rowsPerPageOptions: [3, 5, 25, 50],
                page: 0
            },
            translations: {
                body: {
                    noMatch: text(
                        'body.noMatch',
                        'Sorry, no matching records found',
                        'Options.translations'
                    ),
                    toolTip: text('body.toolTip', 'Sort', 'Options.translations'),
                    summary: text('body.summary', 'SUMMARY', 'Options.translations')
                },
                pagination: {
                    next: text('pagination.next', 'Next Page', 'Options.translations'),
                    previous: text('pagination.previous', 'Previous Page', 'Options.translations'),
                    rowsPerPage: text(
                        'pagination.rowsPerPage',
                        'Rows per page:',
                        'Options.translations'
                    ),
                    displayRows: text('pagination.displayRows', 'of', 'Options.translations')
                },
                toolbar: {
                    search: text('toolbar.search', 'Search', 'Options.translations'),
                    downloadCsv: text(
                        'toolbar.downloadCsv',
                        'Download CSV',
                        'Options.translations'
                    ),
                    print: text('toolbar.print', 'Print', 'Options.translations'),
                    viewColumns: text(
                        'toolbar.viewColumns',
                        'View Columns',
                        'Options.translations'
                    ),
                    filterTable: text('toolbar.filterTable', 'Filter Table', 'Options.translations')
                },
                filter: {
                    all: text('filter.all', 'All', 'Options.translations'),
                    title: text('filter.title', 'FILTERS', 'Options.translations'),
                    reset: text('filter.reset', 'RESET', 'Options.translations')
                },
                viewColumns: {
                    title: text('viewColumns.title', 'Show Columns', 'Options.translations'),
                    titleAria: text(
                        'viewColumns.titleAria',
                        'Show/Hide Table Columns',
                        'Options.translations'
                    )
                },
                selectedRows: {
                    text: text('selectedRows.text', 'row(s) selected', 'Options.translations'),
                    delete: text('selectedRows.delete', 'Delete', 'Options.translations'),
                    deleteAria: text(
                        'selectedRows.deleteAria',
                        'Delete Selected Rows',
                        'Options.translations'
                    )
                }
            },
            display: {
                paginate: boolean('paginate', true, 'Options.display'),
                sort: boolean('sort', true, 'Options.display'),
                filter: boolean('filter', true, 'Options.display'),
                search: boolean('search', true, 'Options.display'),
                print: boolean('print', false, 'Options.display'),
                download: boolean('download', false, 'Options.display'),
                viewColumns: boolean('viewColumns', true, 'Options.display'),
                fixedHeader: boolean('fixedHeader', true, 'Options.display')
            }
        };

        return <MUITable {...propsKnob} data={EXAMPLE_DATA} />;
    },
    { info: { inline: true } }
);
