import MomentUtils from "@date-io/moment";
import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core/styles";
import { InlineDatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import * as React from "react";
import { useMUITableContext } from "../MUITable";

const styles = (theme: Theme) =>
    createStyles({
        datePickerWrapper: {
            display: "flex",
            justifyContent: "flex-end"
        },
        datePicker: {
            margin: "0 10px"
        }
    });

const MUITableDatePicker = (props: WithStyles<typeof styles>) => {
    const { classes } = props;
    const { options } = useMUITableContext();
    const {
        toolbar: { startDate, endDate, showDates, handleDateChange, customToolbar }
    } = options;
    const start = startDate ? startDate : new Date();
    const end = endDate ? endDate : new Date();
    if (showDates && !handleDateChange) {
        throw new Error("showDates=true provided to MUITableDatePicker but no handler provided");
    }
    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className={classes.datePickerWrapper}>
                {customToolbar ? customToolbar() : null}
                {showDates ? (
                    <InlineDatePicker
                        className={classes.datePicker}
                        label="Start Date"
                        value={start}
                        onChange={handleDateChange ? handleDateChange(true) : (value: any) => {}}
                        disableFuture={true}
                        maxDate={end}
                    />
                ) : null}
                {showDates ? (
                    <InlineDatePicker
                        className={classes.datePicker}
                        label="End Date"
                        value={end}
                        onChange={handleDateChange ? handleDateChange(false) : (value: any) => {}}
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
