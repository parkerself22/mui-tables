import React from "react";
import { cleanup, render } from "react-testing-library";
import sinon from "sinon";
import MUITableToolbarSelect from "../../../src/components/Toolbars/MUITableToolbarSelect";
import { DEFAULT_CONTEXT } from "../../../src/constants";
import { EXAMPLE_INPUT_DATA, MUITableTestContext } from "../../utils";

const sandbox = sinon.createSandbox();

afterEach(cleanup);

describe("MUITableToolbarSelect", () => {
    test("renders", () => {
        const testFn = () => render(<MUITableToolbarSelect />);
        expect(testFn).not.toThrow();
    });
    test("renders customToolbarSelect if exists", () => {
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
    test("default context bs", () => {
        const testFn = () => DEFAULT_CONTEXT.getVisibleColumns();
        expect(testFn).not.toThrow();
    })
});
