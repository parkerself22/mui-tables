import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useMUITableContext } from '../MUITable';

export const styles = (theme: Theme) => ({
    __docgenInfo: {},
    displayName: {},
    root: {
        padding: '16px 24px 16px 24px',
        fontFamily: 'Roboto'
    },
    title: {
        marginLeft: '-7px',
        fontSize: '14px',
        color: theme.palette.text.secondary,
        textAlign: 'left' as 'left',
        fontWeight: 500
    },
    formGroup: {
        marginTop: '8px'
    },
    formControl: {},
    checkbox: {
        padding: '0px',
        width: '32px',
        height: '32px'
    },
    checkboxRoot: {
        '&$checked': {
            color: theme.palette.primary.main
        }
    },
    checked: {},
    label: {
        fontSize: '15px',
        marginLeft: '8px',
        color: theme.palette.text.primary
    }
});

const MUITableViewCols = (props: WithStyles<typeof styles>) => {
    const { classes } = props;
    const { columns, options, toggleViewColumn, viewColumns } = useMUITableContext();
    const textLabels = options.translations.viewColumns;
    return (
        <FormControl
            component={'fieldset' as any}
            className={classes.root}
            aria-label={textLabels.titleAria}
        >
            <Typography variant="caption" className={classes.title}>
                {textLabels.title}
            </Typography>
            <FormGroup className={classes.formGroup}>
                {columns.map((column, index) => {
                    return (
                        <FormControlLabel
                            key={index}
                            classes={{ root: classes.formControl, label: classes.label }}
                            control={
                                <Checkbox
                                    className={classes.checkbox}
                                    classes={{
                                        root: classes.checkboxRoot,
                                        checked: classes.checked
                                    }}
                                    onChange={() => toggleViewColumn(index)}
                                    checked={!!viewColumns[index]}
                                    value={column.name}
                                />
                            }
                            label={column.title ? column.title : column.name}
                        />
                    );
                })}
            </FormGroup>
        </FormControl>
    );
};
export default withStyles(styles, { name: 'MUITableViewCols' })(
    MUITableViewCols
) as React.FunctionComponent<{}>;
