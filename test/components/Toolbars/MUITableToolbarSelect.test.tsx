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
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        rows: {
                            ...DEFAULT_CONTEXT.options.rows,
                            customToolbarSelect
                        }
                    }
                }}
            >
                <MUITableToolbarSelect />
            </MUITableTestContext>
        );
        expect(customToolbarSelect.called).toBe(true);
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
