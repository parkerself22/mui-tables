import React from "react";
import { cleanup, render, fireEvent } from "react-testing-library";
import MUITableBodyRow from "../../../src/components/Body/MUITableBodyRow";
import { DEFAULT_COL, DEFAULT_OPTS } from "../../../src/constants";
import { MUITableTestContext } from "../../utils";
import sinon from "sinon";

const sandbox = sinon.createSandbox();

afterEach(cleanup);
describe("MUITableBodyRow", () => {
    test("returns an empty row when no display rows exist", () => {
        const { getByText } = render(
            <MUITableTestContext override={{ displayRows: [] }}>
                <MUITableBodyRow index={0}>Test</MUITableBodyRow>
            </MUITableTestContext>
        );
        expect(() => getByText("Test")).not.toThrow();
    });
    test("calls onRowClick if provided", () => {
        const onRowClick = sandbox.spy();
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    displayRows: [[{ column: DEFAULT_COL, display: "Test", value: "Test" }]],
                    options: {
                        ...DEFAULT_OPTS,
                        hooks: {
                            onRowClick
                        }
                    }
                }}
            >
                <MUITableBodyRow
                    testId={"testBodyRow"}
                    index={0}
                    row={[{ column: DEFAULT_COL, display: "Test", value: "Test" }]}
                >
                    Test
                </MUITableBodyRow>
            </MUITableTestContext>
        );
        const row = getByTestId("testBodyRow");
        fireEvent.click(row);
        expect(onRowClick.called).toBe(true);
    });
});
