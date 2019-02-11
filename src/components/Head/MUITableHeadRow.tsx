import { WithStyles, withStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import React from 'react';

const defaultHeadRowStyles = {
    root: {}
};

interface Props {
    children: any;
}

const TableHeadRow = (props: Props & WithStyles<typeof defaultHeadRowStyles>) => {
    const { classes } = props;
    return (
        <TableRow
            className={classNames({
                [classes.root]: true
            })}
        >
            {props.children}
        </TableRow>
    );
};

export default withStyles(defaultHeadRowStyles, { name: 'MUITableHeadRow' })(
    TableHeadRow
) as React.FunctionComponent<Props>;
