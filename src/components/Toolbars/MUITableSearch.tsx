import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import { Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import React, { ChangeEvent, KeyboardEvent } from 'react';
import { MUITableContext } from '../../types';

const defaultSearchStyles = (theme: Theme) => ({
    main: {
        display: 'flex',
        flex: '1 0 auto'
    },
    searchIcon: {
        color: theme.palette.text.secondary,
        marginTop: '10px',
        marginRight: '8px'
    },
    searchText: {
        flex: '0.8 0'
    },
    clearIcon: {
        '&:hover': {
            color: theme.palette.error.main
        }
    }
});

export interface MUITableSearchProps {
    context: MUITableContext;
    toggleSearchVisible: () => void;
}

interface Props extends WithStyles<typeof defaultSearchStyles>, MUITableSearchProps {}

export class MUITableSearch extends React.Component<Props> {
    handleTextChange = (event: ChangeEvent<any>) => {
        const { searchTextUpdate, options } = this.props.context;
        if (options.hooks && options.hooks.onSearchChange) {
            options.hooks.onSearchChange(event.target.value);
        }
        searchTextUpdate(event.target.value);
    };

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown as any, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyDown as any, false);
    }

    onKeyDown = (event: KeyboardEvent) => {
        const { toggleSearchVisible } = this.props;
        if (event.keyCode === 27) {
            toggleSearchVisible();
        }
    };

    render() {
        const { classes, context, toggleSearchVisible } = this.props;
        const {
            options: { translations }
        } = context;
        return (
            <Grow appear in={true} timeout={300}>
                <div className={classes.main}>
                    <SearchIcon className={classes.searchIcon} />
                    <TextField
                        className={classes.searchText}
                        autoFocus={true}
                        InputProps={{
                            'aria-label': translations.toolbar.search
                        }}
                        onChange={this.handleTextChange}
                        fullWidth={true}
                    />
                    <IconButton
                        className={classes.clearIcon}
                        data-testid="toggleSearchVisible"
                        onClick={toggleSearchVisible}
                    >
                        <ClearIcon />
                    </IconButton>
                </div>
            </Grow>
        );
    }
}

export default withStyles(defaultSearchStyles, { name: 'MUITableSearch' })(
    MUITableSearch
) as React.ComponentType<MUITableSearchProps>;
