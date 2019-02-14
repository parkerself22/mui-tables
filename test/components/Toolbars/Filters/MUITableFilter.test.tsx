import React from "react";
import { cleanup, render, fireEvent, wait } from "react-testing-library";
import MUITableFilter from "../../../../src/components/Toolbars/Filters/MUITableFilter";
import MUITableFilterList from "../../../../src/components/Toolbars/Filters/MUITableFilterList";
import MUITableUtils from "../../../../src/constants/MUITableUtils";
import { EXAMPLE_COLUMNS, EXAMPLE_INPUT_DATA, MUITableTestContext } from "../../../utils";
import sinon from "sinon";

const sandbox = sinon.createSandbox();
afterEach(cleanup);

describe("MUITableFilter", () => {
    test("renders with title", () => {
        const { getByText } = render(
            <MUITableTestContext>
                <MUITableFilter />
            </MUITableTestContext>
        );
        const test = () => getByText("FILTERS");
        expect(test).not.toThrow();
    });
    test("renders with reset button", () => {
        const { getByText } = render(
            <MUITableTestContext>
                <MUITableFilter />
            </MUITableTestContext>
        );
        const test = () => getByText("RESET");
        expect(test).not.toThrow();
    });
    test("renders MUITableSelectFilter", () => {
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => ["t"]);
        const columns = EXAMPLE_COLUMNS.map(c => {
            if (c.filterOptions) {
                c.filterOptions.type = "dropdown";
            }
            return c;
        });
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    columns,
                    displayRows: rows,
                    data: EXAMPLE_INPUT_DATA
                }}
            >
                <MUITableFilter />
            </MUITableTestContext>
        );
        const test = () => getByText("Date");
        expect(test).not.toThrow();
    });
    test("renders MUITableMultiSelectFilter", () => {
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => ["t"]);
        const columns = EXAMPLE_COLUMNS.map(c => {
            if (c.filterOptions) {
                c.filterOptions.type = "multiselect";
            }
            return c;
        });
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    columns,
                    displayRows: rows,
                    data: EXAMPLE_INPUT_DATA
                }}
            >
                <MUITableFilter />
            </MUITableTestContext>
        );
        const test = () => getByText("Date");
        expect(test).not.toThrow();
    });
    test("renders MUITableCheckBoxFilter", () => {
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => ["t"]);
        const columns = EXAMPLE_COLUMNS.map(c => {
            if (c.filterOptions) {
                c.filterOptions.type = "checkbox";
            }
            return c;
        });
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    columns,
                    displayRows: rows,
                    data: EXAMPLE_INPUT_DATA
                }}
            >
                <MUITableFilter />
            </MUITableTestContext>
        );
        const test = () => getByText("Date");
        expect(test).not.toThrow();
    });
    test("handles MUITableSelectFilter change", async () => {
        const onFilterUpdate = sandbox.spy();
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => ["t"]);
        const columns = EXAMPLE_COLUMNS.map(c => {
            if (c.filterOptions) {
                c.filterOptions.type = "dropdown";
            }
            return c;
        });
        const { getByTestId, getByRole } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    columns,
                    onFilterUpdate,
                    displayRows: rows,
                    data: EXAMPLE_INPUT_DATA,
                    getFilterData: () => ["ttt", "ttt"]
                }}
            >
                <MUITableFilter />
            </MUITableTestContext>
        );
        const child = getByTestId("MUITableSelectFilterVal").parentElement;
        fireEvent.click(child as any);
        const opt = getByRole("option");
        fireEvent.click(opt as any);
        expect(onFilterUpdate.called).toBe(true);
    });
    test("handles MUITableMultiSelectFilter change", () => {
        const onFilterUpdate = sandbox.spy();
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => []);
        const columns = EXAMPLE_COLUMNS.map(c => {
            if (c.filterOptions) {
                c.filter = true;
                c.filterOptions.type = "multiselect";
            }
            return c;
        });
        const { getByTestId, getByRole } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    columns,
                    onFilterUpdate,
                    displayRows: rows,
                    data: EXAMPLE_INPUT_DATA,
                    getFilterData: () => ["ttt", "ttt"]
                }}
            >
                <MUITableFilter />
            </MUITableTestContext>
        );
        // @ts-ignore
        const child = getByTestId("MUITableMultiSelectFilterVal").parentElement;
        fireEvent.click(child as any);
        const opt = getByRole("listbox").firstChild;
        fireEvent.click(opt as any);
        expect(onFilterUpdate.called).toBe(true);
    });
    test("handles MUITableCheckBoxFilter change", () => {
        const onFilterUpdate = sandbox.spy();
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => []);
        const columns = EXAMPLE_COLUMNS.map(c => {
            if (c.filterOptions) {
                c.filter = true;
                c.filterOptions.type = "checkbox";
            }
            return c;
        });
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    columns,
                    onFilterUpdate,
                    displayRows: rows,
                    data: EXAMPLE_INPUT_DATA,
                    getFilterData: () => ["ttt", "ttt"]
                }}
            >
                <MUITableFilter />
            </MUITableTestContext>
        );
        // @ts-ignore
        const child = getByTestId("MUITableCheckBoxFilterVal");
        fireEvent.click(child as any);
        expect(onFilterUpdate.called).toBe(true);
    });
    test("filterList removal", () => {
        const onFilterUpdate = sandbox.spy();
        const rows = MUITableUtils.buildRows(EXAMPLE_INPUT_DATA, EXAMPLE_COLUMNS);
        const columnFilters = EXAMPLE_COLUMNS.map(c => ["ttt"]);
        const columns = EXAMPLE_COLUMNS.map(c => {
            if (c.filterOptions) {
                c.filter = true;
                c.filterOptions.type = "checkbox";
            }
            return c;
        });
        const { getByRole } = render(
            <MUITableTestContext
                override={{
                    rows,
                    columnFilters,
                    columns,
                    onFilterUpdate,
                    displayRows: rows,
                    data: EXAMPLE_INPUT_DATA
                }}
            >
                <MUITableFilterList />
            </MUITableTestContext>
        );
        // @ts-ignore
        const child = getByRole("presentation");
        fireEvent.click(child as any);
        expect(onFilterUpdate.called).toBe(true);
    });
});
