import { Theme, WithStyles, withStyles } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow/TableRow';
import classNames from 'classnames';
import * as React from 'react';
import { Row } from '../../types';
import { useMUITableContext } from '../MUITable';

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
    const { selected, classes, className, testId } = props;
    const { options } = useMUITableContext();

    return (
        <TableRow
            hover={options.rows.rowHover}
            data-testid={testId}
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
