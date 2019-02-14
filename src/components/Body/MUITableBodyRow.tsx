import { Theme, WithStyles, withStyles } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow/TableRow';
import classNames from 'classnames';
import * as React from 'react';
import { useMUITableContext } from '../MUITable';
import { Row } from '../../types';

const styles = (theme: Theme) => ({
    root: {}
});

export interface MUITableBodyRowProps {
    row?: Row<any>;
    index: number;
    hover?: boolean;
    selected?: boolean;
    className?: string;
    testId?: string;
    children?: any;
}

interface Props extends MUITableBodyRowProps, WithStyles<typeof styles> {}

const MUITableBodyRow = (props: Props) => {
    const { selected, classes, className, row, index, testId } = props;
    const { options } = useMUITableContext();

    return (
        <TableRow
            hover={options.rows.rowHover}
            data-testid={testId}
            onClick={() => {
                if (options.hooks && options.hooks.onRowClick && row) {
                    options.hooks.onRowClick(row, index);
                }
            }}
            className={classNames(classes.root, className)}
            selected={selected}
        >
            {props.children}
        </TableRow>
    );
};

export default withStyles(styles, { name: 'MUITableBodyRow' })(
    MUITableBodyRow
) as React.FunctionComponent<MUITableBodyRowProps>;
