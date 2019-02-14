import React from "react";
import { cleanup, render } from "react-testing-library";
import sinon from "sinon";
import MUITableFooter from "../../../src/components/Footer/MUITableFooter";
import { DEFAULT_OPTS } from "../../../src/constants";
import { MUITableTestContext } from "../../utils";

const sandbox = sinon.createSandbox();

afterEach(cleanup);

describe("MUITableFooter", () => {
    test("renders pagination", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: true
                        }
                    }
                }}
            >
                <MUITableFooter/>
            </MUITableTestContext>
        );
        const test = () => getByText("Rows per page:");
        expect(test).not.toThrow();
    });
    test("renders null if options.display.paginate = false", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: false
                        }
                    }
                }}
            >
                <MUITableFooter/>
            </MUITableTestContext>
        );
        const test = () => getByText("Rows per page:");
        expect(test).toThrow();
    });

    test("calls customFooter if supplied", () => {
        const spy = sandbox.spy();
        render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: true
                        },
                        pagination: {
                            ...DEFAULT_OPTS.pagination,
                            customFooter: spy
                        }
                    }
                }}
            >
                <MUITableFooter/>
            </MUITableTestContext>
        );
        expect(spy.called).toBe(true);
    });
});
