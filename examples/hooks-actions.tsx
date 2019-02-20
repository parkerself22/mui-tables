import { Typography } from '@material-ui/core';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import MUITable from 'mui-tables';
import React from 'react';
import { HookOptions } from '../src/types';

const data = [
    { name: 'Bob', demographics: { age: 29, gender: 'male' } },
    { name: 'Alice', demographics: { age: 34, gender: 'female' } }
];

const columns = {
    static: [
        {
            name: 'name',
            title: 'Name',
            calculateCellDefinition: (entry: any) => ({
                display: entry.name,
                value: entry.name
            })
        },
        {
            name: 'gender',
            title: 'Gender',
            calculateCellDefinition: (entry: any) => ({
                display: entry.demographics.gender,
                value: entry.demographics.gender
            })
        }
    ]
};

export const HooksExample = () => {
    const hooks: HookOptions<any> = {
        onSearchChange: boolean('onSearchChange', true, 'Options.hooks')
            ? action(`onSearchChange`)
            : undefined,
        onFilterChange: boolean('onFilterChange', true, 'Options.hooks')
            ? action(`onFilterChange`)
            : undefined,
        onColumnSortChange: boolean('onColumnSortChange', true, 'Options.hooks')
            ? action(`onColumnSortChange`)
            : undefined,
        onColumnViewChange: boolean('onColumnViewChange', true, 'Options.hooks')
            ? action(`onColumnViewChange`)
            : undefined,
        onRowsSelect: boolean('onRowsSelect', true, 'Options.hooks')
            ? action(`onRowsSelect`)
            : undefined,
        onRowsDelete: boolean('onRowsDelete', true, 'Options.hooks')
            ? action(`onRowsDelete`)
            : undefined,
        onRowClick: boolean('onRowClick', true, 'Options.hooks') ? action(`onRowClick`) : undefined,
        onCellClick: boolean('onCellClick', true, 'Options.hooks')
            ? action(`onCellClick`)
            : undefined,
        onChangePage: boolean('onChangePage', true, 'Options.hooks')
            ? action(`onChangePage`)
            : undefined,
        onChangeRowsPerPage: boolean('onChangeRowsPerPage', true, 'Options.hooks')
            ? action(`onChangeRowsPerPage`)
            : undefined
    };
    return (
        <React.Fragment>
            <Typography variant={'body1'} gutterBottom>
                Click on the Action Logger tab below to see hooks in action! They can be toggled on
                and off in the Knobs tabs
            </Typography>
            <MUITable
                data={data}
                title={'Hooks Example'}
                columns={columns}
                loading={false}
                hooks={hooks as any}
            />
        </React.Fragment>
    );
};
