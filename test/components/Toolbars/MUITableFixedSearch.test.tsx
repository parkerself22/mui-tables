import MuiPopover from '@material-ui/core/Popover';
import React from 'react';
import ReactRenderer from 'react-test-renderer';
import { cleanup, fireEvent, render } from 'react-testing-library';
import sinon from 'sinon';
import MUITableFixedSearch, { FixedSearchPopover } from '../../../src/components/Toolbars/MUITableFixedSearch';
import { DEFAULT_CONTEXT, MUITABLE_DEF_CONTEXT } from '../../../src/constants';
import { MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

describe('MUITableFixedSearch', () => {
    const fixedSearchPopoverInstance = () => {
        const renderer = ReactRenderer.create(
            <MUITABLE_DEF_CONTEXT.Provider value={DEFAULT_CONTEXT}>
                <FixedSearchPopover classes={{} as any} />
            </MUITABLE_DEF_CONTEXT.Provider>
        );
        // @ts-ignore
        const instance = renderer.root.findByType(MuiPopover);
        return instance.instance;
    };
    test('renders', () => {
        const testFn = () =>
            render(
                <MUITableTestContext>
                    <MUITableFixedSearch />
                </MUITableTestContext>
            );
        expect(testFn).not.toThrow();
    });
    test('handles refExit', () => {
        const inst = fixedSearchPopoverInstance();
        // @ts-ignore
        const testFn = () => inst.props.onExited();
        expect(testFn).not.toThrow();
    });
    test('renders with text', () => {
        const value = Math.random().toString();
        const { getByTestId, getByValue, rerender } = render(
            <MUITableTestContext
                override={{
                    search: {
                        open: true,
                        text: value
                    }
                }}
            >
                <MUITableFixedSearch />
            </MUITableTestContext>
        );
        const test = () => getByValue(value);
        expect(test).not.toThrow();
    });
    test('handles text clearing', () => {
        const searchTextUpdate = sandbox.spy();
        const { getByTestId, getByValue, rerender } = render(
            <MUITableTestContext
                override={{
                    searchTextUpdate,
                    search: {
                        open: true,
                        text: 'test'
                    }
                }}
            >
                <MUITableFixedSearch />
            </MUITableTestContext>
        );
        const clearButton = getByTestId('clear-fixed-search');
        fireEvent.click(clearButton);
        expect(searchTextUpdate.called).toBe(true);
        expect(searchTextUpdate.calledOnceWith('')).toBe(true);
    });
    test('handles text input', async () => {
        const searchTextUpdate = sandbox.spy();
        const toggleSearchVisible = sandbox.spy();
        const override = {
            searchTextUpdate,
            toggleSearchVisible,
            search: {
                open: false,
                text: 'test'
            }
        };
        const { getByTestId, getByValue, rerender } = render(
            <MUITableTestContext override={override}>
                <MUITableFixedSearch />
            </MUITableTestContext>
        );
        const input = getByTestId('fixed-search-input');
        // @ts-ignore
        input._valueTracker.setValue('test2');
        fireEvent.input(input, { target: input, value: 'test2' });
        expect(searchTextUpdate.called).toBe(true);
        expect(toggleSearchVisible.called).toBe(true);
    });
    test('handles null input', async () => {
        const searchTextUpdate = sandbox.spy();
        const toggleSearchVisible = sandbox.spy();
        const override = {
            searchTextUpdate,
            toggleSearchVisible,
            search: {
                open: false,
                text: null
            }
        };
        const { getByTestId, getByValue, rerender } = render(
            <MUITableTestContext override={override}>
                <MUITableFixedSearch />
            </MUITableTestContext>
        );
        const input = getByTestId('fixed-search-input');
        // @ts-ignore
        input._valueTracker.setValue(null);
        fireEvent.input(input, { target: input, value: null });
        expect(searchTextUpdate.called).toBe(true);
        expect(toggleSearchVisible.called).toBe(false);
    });
    test('handles rendering the popover', async () => {
        const searchTextUpdate = sandbox.spy();
        const toggleSearchVisible = sandbox.spy();
        const override = {
            searchTextUpdate,
            toggleSearchVisible,
            search: {
                open: false,
                text: 'test'
            }
        };
        const { getByTestId, getByText, rerender } = render(
            <MUITableTestContext override={override}>
                <MUITableFixedSearch />
            </MUITableTestContext>
        );
        const filterButton = getByTestId('fixed-search-filter');
        fireEvent.click(filterButton);
        const test = () => getByText('FILTERS');
        expect(test).not.toThrow();
    });
});
