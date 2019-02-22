import { createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import CloseIcon from '@material-ui/icons/Close';
import FilterIcon from '@material-ui/icons/KeyboardArrowDown';
import SearchIcon from '@material-ui/icons/Search';
import { ChangeEventHandler, default as React, useState } from 'react';
import { useMUITableContext } from '../MUITable';
import MUITableFilter from './Filters/MUITableFilter';
import Popover from './MUITablePopover';

const popStyles = (theme: Theme) =>
    createStyles({
        icon: {
            '&:hover': {
                color: theme.palette.primary.main
            }
        },
        iconActive: {
            color: theme.palette.primary.main
        },
        iconButton: {
            padding: 7
        },
        pop: {
            maxHeight: 400
        }
    });

export const FixedSearchPopover = (props: WithStyles<typeof popStyles>) => {
    const { classes } = props;
    const { options } = useMUITableContext();
    const [active, setActive] = useState<boolean>(false);

    return (
        <Popover
            open={active}
            refExit={() => setActive(!active)}
            className={classes.pop}
            trigger={
                <IconButton
                    data-testid={'fixed-search-filter'}
                    aria-label={options.translations.filter.title}
                    className={classes.iconButton}
                    classes={{ root: active ? classes.iconActive : classes.icon }}
                    onClick={() => setActive(!active)}
                >
                    <Tooltip title={options.translations.filter.title}>
                        <FilterIcon />
                    </Tooltip>
                </IconButton>
            }
            content={<MUITableFilter />}
        />
    );
};

const FSPop = withStyles(popStyles, { withTheme: true })(FixedSearchPopover);

const searchStyles = (theme: Theme) =>
    createStyles({
        root: {
            padding: '20px 0'
        },
        textField: {
            margin: 0,
            paddingTop: 10
        },
        input: {
            padding: 0,
            height: 46
        },
        notchedOutline: {
            borderColor: `${theme.palette.grey['100']} !important`
        },
        cssFocused: {},
        inputRoot: {
            background: theme.palette.grey['100'],
            border: 'none',
            boxSizing: 'border-box',
            borderRadius: 4,
            '&$inputFocused $notchedOutline': {
                borderColor: `white !important`,
                boxShadow: theme.shadows[1]
            }
        },
        inputFocused: {
            background: theme.palette.common.white,
            borderColor: `${theme.palette.divider} !important`
        },
        icon: {
            color: theme.palette.text.secondary
        },
        iconButton: {
            color: theme.palette.text.secondary,
            padding: 7
        },
        wrapper: {
            padding: 5,
            justifyItems: 'flex-start',
            alignItems: 'center',
            display: 'flex'
        },
        adornment: {
            marginLeft: 0
        },
        tabWrapper: {
            borderTop: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            marginTop: 20
        },
        tab: {
            '&:hover': {
                background: theme.palette.grey['100']
            }
        },
        customSelectWrap: {
            position: 'absolute' as 'absolute',
            width: '100%',
            left: 0,
            top: 0
        }
    });

const MUITableFixedSearch = (props: WithStyles<typeof searchStyles>) => {
    const { classes } = props;
    const { searchTextUpdate, search, options, toggleSearchVisible } = useMUITableContext();
    const { title } = options;

    // Event handler for text field
    const onChange: ChangeEventHandler<any> = e => {
        changeText(e.target.value ? e.target.value : null);
    };
    // Used by close button
    const changeText = (text?: string) => {
        if (!search.open && !!text) {
            toggleSearchVisible();
        }
        searchTextUpdate(text ? text : '');
    };

    return (
        <Grid
            spacing={0}
            container
            className={classes.root}
            alignItems={'center'}
            data-testid={'FixedSearch'}
        >
            <Grid item xs={6}>
                <Typography variant={'h5'} gutterBottom>
                    {title}
                </Typography>
                <TextField
                    data-testid="fixed-search"
                    className={classes.textField}
                    value={search.text ? search.text : ''}
                    onChange={onChange}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        inputProps: {
                            'data-testid': 'fixed-search-input'
                        },
                        classes: {
                            root: classes.inputRoot,
                            focused: classes.inputFocused,
                            notchedOutline: classes.notchedOutline,
                            input: classes.input
                        },
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon className={classes.icon} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <React.Fragment>
                                {search.text && search.text.length > 0 ? (
                                    <InputAdornment position="end" className={classes.adornment}>
                                        <IconButton
                                            data-testid={'clear-fixed-search'}
                                            id={'clear-fixed-search'}
                                            className={classes.iconButton}
                                            onClick={() => changeText()}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null}
                                <InputAdornment position="end" className={classes.adornment}>
                                    <FSPop />
                                </InputAdornment>
                            </React.Fragment>
                        )
                    }}
                />
            </Grid>
        </Grid>
    );
};
export default withStyles(searchStyles, { withTheme: true, name: 'MUITableFixedSearch' })(
    MUITableFixedSearch
);
