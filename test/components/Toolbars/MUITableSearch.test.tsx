import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import { cleanup, fireEvent, render } from 'react-testing-library';
import sinon from 'sinon';
import {
    MUITableSearch,
    MUITableSearchProps
} from '../../../src/components/Toolbars/MUITableSearch';
import MUITableToolbar from '../../../src/components/Toolbars/MUITableToolbar';
import MUITableViewCols from '../../../src/components/Toolbars/MUITableViewCols';
import { DEFAULT_CONTEXT } from '../../../src/constants';
import { MUITableContext, Optional } from '../../../src/types';
import { EXAMPLE_COLUMNS, MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

function searchInstance(props?: Optional<MUITableSearchProps>): MUITableSearch {
    const defaultProps = {
        context: {
            ...DEFAULT_CONTEXT,
            ...(props ? props.context : {})
        },
        toggleSearchVisible:
            props && props.toggleSearchVisible ? props.toggleSearchVisible : () => {},
        classes: {
            main: "",
            searchIcon: "",
            searchText: "",
            clearIcon: ""
        }
    };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<MUITableSearch {...defaultProps} />);
    const instance = renderer.getMountedInstance();
    return instance as MUITableSearch;
}

describe("MUITableSearch", () => {
    test("handles toggleSearch", () => {
        const toggleSearchVisible = sandbox.spy();
        const context: MUITableContext = {
            ...DEFAULT_CONTEXT,
            toggleSearchVisible,
            search: { open: true, text: "" }
        };
        const { getByTestId } = render(<MUITableToolbar context={context} />);
        const trigger = getByTestId("toggleSearchVisible");
        fireEvent.click(trigger);
        expect(toggleSearchVisible.called).toBe(true);

    });
    test("handles toggleSearch when search closed ", () => {
        const toggleSearchVisible = sandbox.spy();
        const context: MUITableContext = {
            ...DEFAULT_CONTEXT,
            toggleSearchVisible,
            search: { open: false, text: null }
        };
        const { getByTestId, getByTitle } = render(<MUITableToolbar context={context} />);
        const trigger = getByTitle("Search");
        fireEvent.click(trigger);
        expect(toggleSearchVisible.called).toBe(true);

    });
    test("handleTextChange with hooks", () => {
        const onSearchChange = sandbox.spy();
        const instance = searchInstance({
            context: {
                ...DEFAULT_CONTEXT,
                options: {
                    ...DEFAULT_CONTEXT.options,
                    hooks: {
                        ...DEFAULT_CONTEXT.options.hooks,
                        onSearchChange
                    }
                }
            }
        });
        const testFn = () => instance.handleTextChange({ target: { value: "test" } } as any);
        expect(testFn).not.toThrow();
        expect(onSearchChange.called).toBe(true);
    });
    test("handleTextChange without hooks", () => {
        const onSearchChange = sandbox.spy();
        const instance = searchInstance();
        const testFn = () => instance.handleTextChange({ target: { value: "test" } } as any);
        expect(testFn).not.toThrow();
        expect(onSearchChange.called).toBe(false);
    });
    test("onKeyDown with esc", () => {
        const toggleSearchVisible = sandbox.spy();
        const instance = searchInstance({
            toggleSearchVisible
        });
        const testFn = () => instance.onKeyDown({ keyCode: 27 } as any);
        expect(testFn).not.toThrow();
        expect(toggleSearchVisible.called).toBe(true);
    });
    test("onKeyDown without esc", () => {
        const toggleSearchVisible = sandbox.spy();
        const instance = searchInstance({
            toggleSearchVisible
        });
        const testFn = () => instance.onKeyDown({ keyCode: 299 } as any);
        expect(testFn).not.toThrow();
        expect(toggleSearchVisible.called).toBe(false);
    });
    test("componentDidMount", () => {
        const instance = searchInstance();
        const testFn = () => instance.componentDidMount();
        expect(testFn).not.toThrow();
    });
    test("componentWillUnmount", () => {
        const instance = searchInstance();
        const testFn = () => instance.componentWillUnmount();
        expect(testFn).not.toThrow();
    });
});

describe("MUITableViewCols", () => {
    test("renders & changes", () => {
        const toggleViewColumn = sandbox.spy();
        const columns = [...EXAMPLE_COLUMNS];
        columns[0].title = undefined;
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    columns,
                    toggleViewColumn
                }}
            >
                <MUITableViewCols />
            </MUITableTestContext>
        );
        const instance = getByTestId("MUITableViewColsVal");
        fireEvent.click(instance as any);
        expect(toggleViewColumn.called).toBe(true);
    });
});
