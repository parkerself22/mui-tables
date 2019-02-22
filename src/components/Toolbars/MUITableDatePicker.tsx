import MomentUtils from '@date-io/moment';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { InlineDatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import * as React from 'react';
import { useMUITableContext } from '../MUITable';

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
    const context = useMUITableContext();
    const { options } = context;
    const {
        toolbar: {
            startDate,
            endDate,
            showDates,
            handleDateChange,
            customToolbarRight,
            startLabel,
            endLabel
        }
    } = options;
    const start = startDate ? startDate : new Date();
    const end = endDate ? endDate : new Date();
    if (showDates && !handleDateChange) {
        throw new Error('showDates=true provided to MUITableDatePicker but no handler provided');
    }
    if (!showDates && !customToolbarRight) {
        return null;
    }

    const startLabelText = startLabel ? startLabel : 'Start Date';
    const endLabelText = endLabel ? endLabel : 'End Date';

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.datePickerWrapper}>
                {customToolbarRight ? customToolbarRight(context) : null}
                {showDates && startDate && handleDateChange ? (
                    <InlineDatePicker
                        className={classnames(
                            classes.datePicker,
                            'muiTableToolbar-datePicker-start'
                        )}
                        label={startLabelText}
                        value={start}
                        onChange={handleDateChange(true)}
                        disableFuture={true}
                        maxDate={end}
                    />
                ) : null}
                {showDates && endDate && handleDateChange ? (
                    <InlineDatePicker
                        className={classnames(classes.datePicker, 'muiTableToolbar-datePicker-end')}
                        label={endLabelText}
                        value={end}
                        onChange={handleDateChange(false)}
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
