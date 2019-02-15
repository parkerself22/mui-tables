import MUITable from 'mui-tables';
import React from 'react';

const data = [
    { name: 'Bob', demographics: { age: 29, gender: "male" } },
    { name: 'Alice', demographics: { age: 34, gender: "female" } }
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
            name: 'age',
            title: 'Age',
            calculateCellDefinition: (entry: any) => ({
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
