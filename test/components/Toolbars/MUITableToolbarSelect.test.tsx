import React from 'react';
import { cleanup, render } from 'react-testing-library';
import sinon from 'sinon';
import { MUITableUtils } from '../../../src';
import MUITableToolbarSelect from '../../../src/components/Toolbars/MUITableToolbarSelect';
import { DEFAULT_CONTEXT, DEFAULT_OPTS } from '../../../src/constants';
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

describe('MUITableToolbarSelect', () => {
    test('renders', () => {
        const testFn = () => render(<MUITableToolbarSelect />);
        expect(testFn).not.toThrow();
    });
    test('renders customToolbarSelect if exists', () => {
        const customToolbarSelect = sandbox.spy();
        render(
            <MUITableTestContext
                override={{
                    selectedRows: ["1"],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        rows: {
                            ...DEFAULT_CONTEXT.options.rows,
                            customToolbarSelect,
                        }
                    }
                }}
            >
                <MUITableToolbarSelect />
            </MUITableTestContext>
        );
        expect(customToolbarSelect.called).toBe(true);
    });
    test('renders customToolbarSelect if !selectBarTop', () => {
        const customToolbarSelect = sandbox.spy();
        render(
            <MUITableTestContext
                override={{
                    selectedRows: ["1"],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        rows: {
                            ...DEFAULT_CONTEXT.options.rows,
                            customToolbarSelect,
                            selectBarTop: false
                        }
                    }
                }}
            >
                <MUITableToolbarSelect />
            </MUITableTestContext>
        );
        expect(customToolbarSelect.called).toBe(true);
    });
    test('does not render delete button if hideSelectDelete', () => {
        const { getByTitle, getByRole } = render(
            <MUITableTestContext
                override={{
                    selectedRows: ["1"],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        rows: {
                            ...DEFAULT_CONTEXT.options.rows,
                            selectBarTop: false,
                            hideSelectDelete: true
                        }
                    }
                }}
            >
                <MUITableToolbarSelect />
            </MUITableTestContext>
        );
        const test = () => getByTitle("Delete");
        const test2 = () => getByRole("select-toolbar");
        expect(test).toThrow();
        expect(test2).not.toThrow();
    });
    test('renders delete button if !hideSelectDelete', () => {
        const customToolbarSelect = sandbox.spy();
        const { getByTitle, getByRole } = render(
            <MUITableTestContext
                override={{
                    selectedRows: ["1"],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        rows: {
                            ...DEFAULT_CONTEXT.options.rows,
                            selectBarTop: false,
                            hideSelectDelete: false
                        }
                    }
                }}
            >
                <MUITableToolbarSelect />
            </MUITableTestContext>
        );
        const test = () => getByTitle("Delete");
        const test2 = () => getByRole("select-toolbar");
        expect(test).not.toThrow();
        expect(test2).not.toThrow();
    });
    test('filters for selectedRows on customToolbarSelect', () => {
        const customToolbarSelect = sandbox.spy();
        render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        rows: {
                            ...DEFAULT_CONTEXT.options.rows,
                            customToolbarSelect
                        }
                    },
                    rows: MUITableUtils.buildRows(
                        EXAMPLE_INPUT_DATA,
                        EXAMPLE_COLUMNS,
                        DEFAULT_OPTS
                    ),
                    selectedRows: ['blah-blah-blah']
                }}
            >
                <MUITableToolbarSelect />
            </MUITableTestContext>
        );
        expect(customToolbarSelect.called).toBe(true);
        expect(customToolbarSelect.args[0][0].length).toBe(0);
    });
    test('default context bs', () => {
        const testFn = () => DEFAULT_CONTEXT.getVisibleColumns();
        expect(testFn).not.toThrow();
    });
});
