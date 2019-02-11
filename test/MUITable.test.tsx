import React from "react";
import { cleanup, render } from "react-testing-library";
import { MUITable } from "../src/components/MUITable";
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from "./utils";

afterEach(cleanup);
describe("MUITable", () => {
    test("renders without crashing", () => {
        const test = () =>
            render(
                <MUITableTestContext override={{ displayRows: [] }}>
                    <MUITable
                        data={EXAMPLE_INPUT_DATA}
                        columns={{ static: EXAMPLE_COLUMNS }}
                        title={"test"}
                        loading={false}
                    />
                </MUITableTestContext>
            );
        expect(test).not.toThrow();
    });
});
