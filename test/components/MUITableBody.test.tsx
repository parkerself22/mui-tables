import React from "react";
import { cleanup, render } from "react-testing-library";
import MUITableBody from "../../src/components/MUITableBody";
import { DEFAULT_COL, DEFAULT_CONTEXT, StateColumn } from "../../src/types/index";
import { MUITableTestContext } from "../utils";

afterEach(cleanup);
describe("MUITableBody", () => {
    test("returns an empty row when no display rows exist", () => {
        const noDataText = DEFAULT_CONTEXT.options.translations.body.noMatch;
        const { getByText } = render(
            <MUITableTestContext override={{ displayRows: [] }}>
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText(noDataText)).not.toThrow();
    });
    test("doesn't return an empty row when display rows exist", () => {
        const noDataText = DEFAULT_CONTEXT.options.translations.body.noMatch;
        const { getByText } = render(
            <MUITableTestContext
                override={{ displayRows: [[{ display: "1", value: 1, column: DEFAULT_COL }]] }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText(noDataText)).toThrow();
    });
    test("uses columns's customBodyRender", () => {
        const column = {
            ...DEFAULT_COL,
            customBodyRender: (col: any) => <p role={"textCustom"}>1</p>
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext override={{ displayRows: [[{ column, display: "1", value: 1 }]] }}>
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByRole("textCustom")).not.toThrow();
    });
    test("renders normal cells", () => {
        const column = {
            ...DEFAULT_COL
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext
                override={{ displayRows: [[{ column, display: "testCell-123", value: 1 }]] }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText("testCell-123")).not.toThrow();
    });
    test("hides cells when column hidden normal cells", () => {
        const column: StateColumn<any> = {
            ...DEFAULT_COL,
            display: "false"
        };
        const { getByText, getByRole } = render(
            <MUITableTestContext
                override={{ displayRows: [[{ column, display: "testCell-123", value: 1 }]] }}
            >
                <MUITableBody />
            </MUITableTestContext>
        );
        expect(() => getByText("testCell-123")).toThrow();
    });
});
