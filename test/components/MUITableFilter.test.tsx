import React from "react";
import { cleanup, render } from "react-testing-library";
import MUITableFilter from "../../src/components/Toolbars/Filters/MUITableFilter";
import MUITableUtils from "../../src/constants/MUITableUtils";
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from "../utils";

afterEach(cleanup);

describe("MUITableFilter", () => {
    test("renders with title", () => {
        const { getByText } = render(
            <MUITableTestContext>
                <MUITableFilter/>
            </MUITableTestContext>
        );
        const test = () => getByText("FILTERS");
        expect(test).not.toThrow();
    });
    test("renders with reset button", () => {
        const { getByText } = render(
            <MUITableTestContext>
                <MUITableFilter/>
            </MUITableTestContext>
        );
        const test = () => getByText("RESET");
        expect(test).not.toThrow();
    });
    test("renders dropdown filter", () => {
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => []);
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    displayRows: rows,
                    columns: EXAMPLE_COLUMNS,
                    data: EXAMPLE_INPUT_DATA
                }}
            >
                <MUITableFilter/>
            </MUITableTestContext>
        );
        const test = () => getByText("Date");
        expect(test).not.toThrow();
    });
    test("renders multiselect filter", () => {
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => []);
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    displayRows: rows,
                    columns: EXAMPLE_COLUMNS,
                    data: EXAMPLE_INPUT_DATA
                }}
            >
                <MUITableFilter/>
            </MUITableTestContext>
        );
        const test = () => getByText("Date");
        expect(test).not.toThrow();
    });
});
