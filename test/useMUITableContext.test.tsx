import React from "react";
import { cleanup, render } from "react-testing-library";
import { DEFAULT_COL } from "../src/constants";
import { MUITableTestContext } from "./utils";

afterEach(cleanup);

describe("useMUITableContext", () => {
    test("throws if child components outside context", () => {
        const mock = jest.spyOn(React, "useContext").mockImplementationOnce(() => null as any);
        const MUITableBodyRow = require("../src/components/Body/MUITableBodyRow").default;
        const testFn = () =>
            render(
                <MUITableBodyRow
                    testId={"testBodyRow"}
                    index={0}
                    row={[{ column: DEFAULT_COL, display: "Test", value: "Test" }]}
                >
                    Test
                </MUITableBodyRow>
            );
        expect(testFn).toThrow(
            `MUITable child components cannot be rendered outside the MUITable component`
        );
        mock.mockClear();
    });
    test("doesn't throws if child components inside context", () => {
        const BodyRow = require("../src/components/Body/MUITableBodyRow").default;
        const test = () =>
            render(
                <MUITableTestContext>
                    <BodyRow
                        testId={"testBodyRow"}
                        index={0}
                        row={[{ column: DEFAULT_COL, display: "Test", value: "Test" }]}
                    >
                        Test
                    </BodyRow>
                </MUITableTestContext>
            );
        expect(test).not.toThrow();
    });
});
