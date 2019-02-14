import React from "react";
import { cleanup, render } from "react-testing-library";
import MUITableFilterList from "../../../../src/components/Toolbars/Filters/MUITableFilterList";
import MUITableUtils from "../../../../src/constants/MUITableUtils";
import { DEFAULT_OPTS } from "../../../../src/constants/index";
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from "../../../utils";

afterEach(cleanup);

describe("MUITableFilterList", () => {
    test("renders chips for filter values", () => {
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => ["TEST"]);
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    columnFilters,
                    columns: EXAMPLE_COLUMNS
                }}
            >
                <MUITableFilterList />
            </MUITableTestContext>
        );
        const test = () => getByText("TEST");
        expect(test).not.toThrow();
    });
    test("renders null if options.display.filterValues = false", () => {
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => ["TEST"]);
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    columnFilters,
                    columns: EXAMPLE_COLUMNS,
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            filterValues: false
                        }
                    }
                }}
            >
                <MUITableFilterList />
            </MUITableTestContext>
        );
        const test = () => getByText("TEST");
        expect(test).toThrow();
    });
});
