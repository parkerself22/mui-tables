import MUITable from './components/MUITable';
import MUITableUtils from './constants/MUITableUtils';
import { MUITABLE_DEF_CONTEXT, DEFAULT_OPTS, DEFAULT_COL } from './constants';

export const MUITableDefaults = {
    context: MUITABLE_DEF_CONTEXT,
    props: DEFAULT_OPTS,
    column: DEFAULT_COL
};

export { MUITableUtils };

export default MUITable;
