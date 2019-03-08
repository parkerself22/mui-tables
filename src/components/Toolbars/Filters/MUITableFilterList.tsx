import Chip from '@material-ui/core/Chip';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { useMUITableContext } from '../../MUITable';
import { StateColumn } from '../../../types/index';

const defaultFilterListStyles = {
    root: {
        display: 'flex',
        justifyContent: 'left',
        flexWrap: 'wrap' as 'wrap',
        margin: '0px 16px 0px 16px'
    },
    chip: {
        margin: '8px 8px 0px 0px'
    }
};

export interface MUITableFilterListProps {}

interface Props extends MUITableFilterListProps, WithStyles<typeof defaultFilterListStyles> {}

const MUITableFilterList = (props: Props) => {
    const { onFilterUpdate, columns, columnFilters, options } = useMUITableContext();
    const { classes } = props;
    if (!options.display.filterValues) {
        return null;
    }

    const filterUpdate = (col: StateColumn<any>, valueIndex: number, value: string) => () => {
        onFilterUpdate(valueIndex, value);
    };

    return (
        <div className={classes.root} id={'MUITable-FilterList'}>
            {columnFilters.map((col, index) =>
                col.map((data, valIndex) => (
                    <Chip
                        label={data}
                        key={`${index}-${valIndex}`}
                        onDelete={filterUpdate(columns[index], index, data)}
                        className={classes.chip}
                    />
                ))
            )}
        </div>
    );
};

export default withStyles(defaultFilterListStyles, { name: 'MUITableFilterList' })(
    MUITableFilterList
);
