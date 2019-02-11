import * as React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

const styles = {
    progressWrap: {
        position: 'absolute' as 'absolute',
        display: 'flex',
        width: '100%',
        zIndex: 200,
        height: 10,
        overflow: 'hidden',
        top: 0,
        borderRadius: 4
    },
    progress: {
        position: 'absolute' as 'absolute',
        display: 'block',
        width: '100%'
    }
};

interface Props {
    loading: boolean;
}

export const MUITableLoader = (props: Props) => {
    const { loading } = props;
    if (!loading) return null;
    return (
        <div style={styles.progressWrap}>
            <LinearProgress style={styles.progress} />
        </div>
    );
};
