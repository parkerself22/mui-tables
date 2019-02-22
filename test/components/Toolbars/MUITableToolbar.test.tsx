import React from 'react';
import { cleanup, render } from 'react-testing-library';
import sinon from 'sinon';
import { useMUITableContext } from '../../../src/components/MUITable';
import MUITableToolbar from '../../../src/components/Toolbars/MUITableToolbar';
import { DEFAULT_CONTEXT, DEFAULT_OPTS } from '../../../src/constants';
import { MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

const ToolbarInstance = () => {
    const context = useMUITableContext();
    return <MUITableToolbar context={context} />;
};

describe('MUITableToolbar', () => {
    test('renders', () => {
        const testFn = () =>
            render(
                <MUITableTestContext>
                    <ToolbarInstance />
                </MUITableTestContext>
            );
        expect(testFn).not.toThrow();
    });
    test('renders fixedSearch', () => {
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    selectedRows: [],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        display: {
                            ...DEFAULT_OPTS.display,
                            fixedSearch: true
                        }
                    }
                }}
            >
                <ToolbarInstance />
            </MUITableTestContext>
        );
        const test = () => getByTestId('FixedSearch');
        expect(test).not.toThrow();
    });
    test('renders customToolbarFull', () => {
        const customToolbarFull = sandbox.spy();
        render(
            <MUITableTestContext
                override={{
                    selectedRows: [],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            customToolbarFull
                        }
                    }
                }}
            >
                <ToolbarInstance />
            </MUITableTestContext>
        );
        expect(customToolbarFull.called).toBe(true);
    });
    test('renders customToolbarLeft', () => {
        const customToolbarLeft = sandbox.spy();
        render(
            <MUITableTestContext
                override={{
                    selectedRows: [],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            customToolbarLeft
                        }
                    }
                }}
            >
                <ToolbarInstance />
            </MUITableTestContext>
        );
        expect(customToolbarLeft.called).toBe(true);
    });
    test('renders customToolbarBottom', () => {
        const customToolbarBottom = sandbox.spy();
        render(
            <MUITableTestContext
                override={{
                    selectedRows: [],
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            customToolbarBottom
                        }
                    }
                }}
            >
                <ToolbarInstance />
            </MUITableTestContext>
        );
        expect(customToolbarBottom.called).toBe(true);
    });
    
});
