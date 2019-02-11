import MomentUtils from '@date-io/moment';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { InlineDatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import * as React from 'react';
import { useMUITableContext } from '../MUITable';
import classnames from 'classnames';

const styles = (theme: Theme) =>
    createStyles({
        datePickerWrapper: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        datePicker: {
            margin: '0 10px'
        }
    });

const MUITableDatePicker = (props: WithStyles<typeof styles>) => {
    const { classes } = props;
    const { options } = useMUITableContext();
    const {
        toolbar: {
            startDate,
            endDate,
            showDates,
            handleDateChange,
            customToolbar,
            startLabel,
            endLabel
        }
    } = options;
    const start = startDate ? startDate : new Date();
    const end = endDate ? endDate : new Date();
    if (showDates && !handleDateChange) {
        throw new Error('showDates=true provided to MUITableDatePicker but no handler provided');
    }
    if (!showDates && !customToolbar) {
        return null;
    }

    const defaultHandler = (value: any) => {};
    const startLabelText = startLabel ? startLabel : 'Start Date';
    const endLabelText = endLabel ? endLabel : 'End Date';

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.datePickerWrapper}>
                {customToolbar ? customToolbar() : null}
                {showDates && startDate ? (
                    <InlineDatePicker
                        className={classnames(
                            classes.datePicker,
                            'muiTableToolbar-datePicker-start'
                        )}
                        label={startLabelText}
                        value={start}
                        onChange={handleDateChange ? handleDateChange(true) : defaultHandler}
                        disableFuture={true}
                        maxDate={end}
                    />
                ) : null}
                {showDates && endDate ? (
                    <InlineDatePicker
                        className={classnames(classes.datePicker, 'muiTableToolbar-datePicker-end')}
                        label={endLabelText}
                        value={end}
                        onChange={handleDateChange ? handleDateChange(false) : defaultHandler}
                        minDate={start}
                        disableFuture={true}
                    />
                ) : null}
            </div>
        </MuiPickersUtilsProvider>
    );
};
export default withStyles(styles, { withTheme: true })(
    MUITableDatePicker
) as React.FunctionComponent<{}>;
