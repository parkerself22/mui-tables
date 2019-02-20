import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs';
import { withNotes } from '@storybook/addon-notes';
import { addDecorator, configure } from '@storybook/react';
import * as React from 'react';

const req = require.context("../src", true, /\.stories\.js$/);
const reqTs = require.context("../", true, /\.stories\.tsx$/);


function loadStories() {
    req.keys().forEach(filename => req(filename));
    reqTs.keys().forEach(filename => reqTs(filename));
}

const theme = createMuiTheme();
const ThemeDecorator = storyFn => <MuiThemeProvider theme={theme}><div style={{paddingTop: 40}}>{storyFn()}</div></MuiThemeProvider>;

addDecorator(ThemeDecorator);
addDecorator(withKnobs);
addDecorator(withInfo({
    propTablesExclude: [MuiThemeProvider]
}));
addDecorator(withNotes);
configure(loadStories, module);
