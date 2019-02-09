import React from "react";
import { cleanup, render } from "react-testing-library";
import MUITableBodyRow from "../../src/components/MUITableBodyRow";
import { MUITableTestContext } from "../utils";

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
});
