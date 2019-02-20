import React from 'react';
import { DEFAULT_COL, DEFAULT_CONTEXT, DEFAULT_OPTS, MUITABLE_DEF_CONTEXT } from '../src/constants';
import MUITableUtils from '../src/constants/MUITableUtils';
import { MUITableContext, Optional, StateColumn } from '../src/types';

export const EXAMPLE_INPUT_DATA = [
    {
        string: 'test',
        number: 1,
        seconds: 110,
        date: '1/1/2018',
        user: 'tester-1@go2impact.com'
    },
    {
        string: 'test2',
        number: 2,
        seconds: 111,
        date: '1/2/2018',
        user: 'boss-tester@go2impact.com'
    },
    {
        string: 'test3',
        number: 3,
        seconds: 5000,
        date: '1/3/2018',
        user: 'random-tester@go2impact.com'
    },
    {
        string: 'test4',
        number: 4,
        seconds: 2000,
        date: '1/4/2018',
        user: 'tester-1@go2impact.com'
    },
    {
        string: 'test5',
        number: 5,
        seconds: 3601,
        date: '1/5/2018',
        user: 'boss-tester@go2impact.com'
    },
    {
        string: 'test6',
        number: 6,
        seconds: 3602,
        date: '1/6/2018',
        user: 'random-tester@go2impact.com'
    },
    {
        string: 'tes7',
        number: 7,
        seconds: 3605,
        date: '1/7/2018',
        user: 'tester-1@go2impact.com'
    },
    {
        string: 'test8',
        number: 8,
        seconds: 3609,
        date: '1/8/2018',
        user: 'boss-tester@go2impact.com'
    },
    {
        string: 'test9',
        number: 9,
        seconds: 3300,
        date: '1/9/2018',
        user: 'random-tester@go2impact.com'
    },
    {
        string: 'test10',
        number: 10,
        seconds: 3400,
        date: '1/10/2018',
        user: 'tester-1@go2impact.com'
    },
    {
        string: 'test11',
        number: 11,
        seconds: 3600,
        date: '1/11/2018',
        user: 'boss-tester@go2impact.com'
    },
    {
        string: 'test12',
        number: 12,
        seconds: 3300,
        date: '1/12/2018',
        user: 'random-tester@go2impact.com'
    },
    {
        string: 'test13',
        number: 13,
        seconds: 32100,
        date: '1/13/2018',
        user: 'tester-1@go2impact.com'
    },
    {
        string: 'test14',
        number: 14,
        seconds: 32300,
        date: '1/14/2018',
        user: 'boss-tester@go2impact.com'
    },
    {
        string: 'test15',
        number: 15,
        seconds: 600,
        date: '1/15/2018',
        user: 'random-tester@go2impact.com'
    }
];

export const EXAMPLE_COLUMNS: StateColumn<any>[] = [
    {
        ...DEFAULT_COL,
        name: 'string',
        title: 'String',
        type: 'dimension',
        display: 'true',
        calculateCellDefinition: entry => ({
            value: entry.string,
            display: entry.string
        }),
        summary: false,
        filterOptions: {
            exact: false,
            type: 'dropdown'
        }
    },
    {
        ...DEFAULT_COL,
        name: 'date',
        title: 'Date',
        type: 'metric',
        calculateCellDefinition: entry => ({
            value: new Date(entry.number),
            display: entry.date
        }),
        summary: false,
        sort: true,
        display: 'true'
    },
    {
        ...DEFAULT_COL,
        name: 'user',
        title: 'User',
        type: 'dimension',
        calculateCellDefinition: entry => ({ value: entry.user, display: entry.user }),
        summary: false
    },
    {
        ...DEFAULT_COL,
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
        sort: true,
        display: 'true'
    },
    {
        ...DEFAULT_COL,
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
        sort: true,
        display: 'true'
    },
    {
        ...DEFAULT_COL,
        name: 'seconds',
        title: 'Time',
        type: 'metric',
        calculateCellDefinition: entry => ({
            value: entry.seconds,
            display: MUITableUtils.formatSeconds(entry.seconds)
        }),
        summaryOptions: {
            type: 'AVG',
            format: 'seconds',
            showComparison: 'whenDifferent'
        },
        summary: true,
        sort: true,
        display: 'true'
    }
];

export const EXAMPLE_ROWS = MUITableUtils.buildRows(
    EXAMPLE_INPUT_DATA,
    EXAMPLE_COLUMNS,
    DEFAULT_OPTS
);

interface Props {
    override?: Optional<MUITableContext>;
    children: any;
}

export const MUITableTestContext = (props: Props) => {
    const { children, override } = props;
    const value = { ...DEFAULT_CONTEXT, ...override };
    return <MUITABLE_DEF_CONTEXT.Provider value={value}>{children}</MUITABLE_DEF_CONTEXT.Provider>;
};
