import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import React from 'react';
import { FilterOpts, StateColumn } from '../../../types';
import { useMUITableContext } from '../../MUITable';

export const defaultFilterStyles = (theme: Theme) => ({
    __docgenInfo: {},
    displayName: {},
    root: {
        backgroundColor: theme.palette.background.default,
        padding: '16px 24px 16px 24px',
        fontFamily: 'Roboto'
    },
    header: {
        flex: '0 0 auto',
        marginBottom: '16px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    title: {
        display: 'inline-block',
        marginLeft: '7px',
        color: theme.palette.text.primary,
        fontSize: '14px',
        fontWeight: 500
    },
    noMargin: {
        marginLeft: '0px'
    },
    reset: {
        alignSelf: 'left'
    },
    resetLink: {
        marginLeft: '16px',
        fontSize: '12px',
        cursor: 'pointer'
    },
    filtersSelected: {
        alignSelf: 'right' as 'right'
    },
    /* checkbox */
    checkboxList: {
        flex: '1 1 100%',
        display: 'inline-flex',
        marginRight: '24px'
    },
    checkboxListTitle: {
        marginLeft: '7px',
        marginBottom: '8px',
        fontSize: '14px',
        color: theme.palette.text.secondary,
        textAlign: 'left' as 'left',
        fontWeight: 500
    },
    checkboxFormGroup: {
        marginTop: '8px'
    },
    checkboxFormControl: {
        margin: '0px'
    },
    checkboxFormControlLabel: {
        fontSize: '15px',
        marginLeft: '8px',
        color: theme.palette.text.primary
    },
    checkboxIcon: {
        width: '32px',
        height: '32px'
    },
    checkbox: {
        '&$checked': {
            color: theme.palette.primary.main
        }
    },
    checked: {},
    /* selects */
    selectRoot: {
        display: 'flex',
        marginTop: '16px',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        width: '100%',
        height: '80%',
        justifyContent: 'space-between'
    },
    selectFormControl: {
        flex: '1 1 calc(50% - 24px)',
        marginRight: '24px',
        marginBottom: '24px'
    },
    /* textField */
    textFieldRoot: {
        display: 'flex',
        marginTop: '16px',
        flexDirection: 'row' as 'row',
        flexWrap: 'wrap' as 'wrap',
        width: '100%'
    },
    textFieldFormControl: {
        flex: '1 1 calc(50% - 24px)',
        marginRight: '24px',
        marginBottom: '24px'
    }
});

interface Props extends WithStyles<typeof defaultFilterStyles> {}

interface RenderFilterProp extends WithStyles<typeof defaultFilterStyles> {
    column: StateColumn<any>;
    index: number;
    currentValues: string[];
}

export const MUITableMultiSelectFilter = (props: RenderFilterProp) => {
    const { classes, column, index, currentValues } = props;
    const { onFilterUpdate, getFilterData } = useMUITableContext();
    const handleMultiselectChange = (e: any) => {
        onFilterUpdate(index, e.target.value);
    };
    const filterData = getFilterData(column);
    const filterList = currentValues;

    return (
        <div className={classes.selectRoot} data-testid="MUITableMultiSelectFilter">
            <FormControl className={classes.selectFormControl} key={index}>
                <InputLabel htmlFor={column.name}>{column.title || column.name}</InputLabel>
                <Select
                    multiple
                    value={filterList}
                    renderValue={selected => (
                        <span data-testid="MUITableMultiSelectFilterVal">
                            {selected ? selected.toString() : null}
                        </span>
                    )}
                    displayEmpty
                    name={column.name}
                    onChange={handleMultiselectChange}
                    input={<Input name={column.name} id={column.name} />}
                >
                    {filterData.map((filterValue, filterIndex) => (
                        <MenuItem value={filterValue} key={filterIndex + 1}>
                            <Checkbox
                                checked={filterList.indexOf(filterValue) >= 0}
                                value={filterValue.toString()}
                                className={classes.checkboxIcon}
                                classes={{
                                    root: classes.checkbox,
                                    checked: classes.checked
                                }}
                            />
                            <ListItemText primary={filterValue} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export const MUITableSelectFilter = (props: RenderFilterProp) => {
    const { classes, column, index, currentValues } = props;
    const {
        options: { translations },
        getFilterData,
        onFilterUpdate
    } = useMUITableContext();

    const handleDropdownChange = (event: any) => {
        const value = event.target.value === 'All' ? '' : event.target.value;
        onFilterUpdate(index, value);
    };

    const filterData = getFilterData(column);
    const filterList = currentValues;
    const textLabels = translations.filter;

    return (
        <div className={classes.selectRoot}>
            <FormControl
                className={classes.selectFormControl}
                key={index}
                data-testid="MUITableSelectFilter"
            >
                <InputLabel htmlFor={column.name}>{column.title || column.name}</InputLabel>
                <Select
                    value={filterList.length > 0 ? filterList.join(',') : textLabels.all}
                    name={column.title || column.name}
                    onChange={handleDropdownChange}
                    input={<Input name={column.name} id={column.name} />}
                    renderValue={value => (
                        <span data-testid="MUITableSelectFilterVal">{value}</span>
                    )}
                >
                    <MenuItem value={textLabels.all} key={0}>
                        {textLabels.all}
                    </MenuItem>
                    {filterData.map((filterValue, filterIndex) => (
                        <MenuItem value={filterValue} key={filterIndex + 1}>
                            {filterValue.toString()}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export const MUITableCheckBoxFilter = (props: RenderFilterProp) => {
    const { getFilterData, onFilterUpdate } = useMUITableContext();
    const { classes, column, index, currentValues } = props;
    const handleCheckboxChange = (value: any) => () => {
        onFilterUpdate(index, value);
    };

    const filterData = getFilterData(column);
    const filterList = currentValues;

    return (
        <div className={classes.checkboxList} key={index} data-testid="MUITableCheckBoxFilter">
            <FormGroup>
                <Typography variant="body2" className={classes.checkboxListTitle}>
                    {column.title || column.name}
                </Typography>
                {filterData.map((filterValue, filterIndex) => (
                    <FormControlLabel
                        key={filterIndex}
                        classes={{
                            root: classes.checkboxFormControl,
                            label: classes.checkboxFormControlLabel
                        }}
                        data-testid={'MUITableCheckBoxFilterVal'}
                        control={
                            <Checkbox
                                className={classes.checkboxIcon}
                                onChange={handleCheckboxChange(filterValue)}
                                checked={filterList.indexOf(filterValue) >= 0}
                                classes={{
                                    root: classes.checkbox,
                                    checked: classes.checked
                                }}
                                value={filterValue}
                            />
                        }
                        label={filterValue}
                    />
                ))}
            </FormGroup>
        </div>
    );
};

// For test coverage need extended type
interface WithFilterOpts extends StateColumn<any> {
    filterOptions: FilterOpts;
}

const MUITableFilter = (props: Props) => {
    const { classes } = props;
    const {
        columns,
        options: { translations },
        onFilterReset,
        columnFilters
    } = useMUITableContext();
    const textLabels = translations.filter;
    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <div className={classes.reset}>
                    <Typography
                        variant="body2"
                        className={classNames({
                            [classes.title]: true
                        })}
                    >
                        {textLabels.title}
                    </Typography>
                    <Button
                        color="primary"
                        className={classes.resetLink}
                        tabIndex={0}
                        aria-label={textLabels.reset}
                        onClick={onFilterReset}
                    >
                        {textLabels.reset}
                    </Button>
                </div>
                <div className={classes.filtersSelected} />
            </div>
            {columns
                .filter<WithFilterOpts>((c): c is WithFilterOpts => !!c.filterOptions)
                .map((col, index) => {
                    return col.filterOptions.type === 'checkbox' ? (
                        <MUITableCheckBoxFilter
                            classes={classes}
                            column={col}
                            index={index}
                            currentValues={columnFilters[index]}
                        />
                    ) : col.filterOptions.type === 'multiselect' ? (
                        <MUITableMultiSelectFilter
                            classes={classes}
                            column={col}
                            index={index}
                            currentValues={columnFilters[index]}
                        />
                    ) : (
                        <MUITableSelectFilter
                            classes={classes}
                            column={col}
                            index={index}
                            currentValues={columnFilters[index]}
                        />
                    );
                })}
        </div>
    );
};

export default withStyles(defaultFilterStyles, { name: 'MUIDataTableFilter' })(
    MUITableFilter
) as React.ComponentType<{}>;
