import React from "react";
import { cleanup, render } from "react-testing-library";
import sinon from "sinon";
import MUITableHead from "../../src/components/MUITableHead";
import { DEFAULT_OPTS } from "../../src/types";
import { EXAMPLE_COLUMNS, MUITableTestContext } from "../utils";

const sandbox = sinon.createSandbox();

afterEach(cleanup);

describe("MUITableHead", () => {
    test("renders column head cells", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    columns: EXAMPLE_COLUMNS,
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS
                    }
                }}
            >
                <MUITableHead />
            </MUITableTestContext>
        );
        for (const col of EXAMPLE_COLUMNS) {
            const test = () => getByText(col.title ? col.title : col.name);
            expect(test).not.toThrow();
        }
    });
    test("renders summaryRow if options.rows.showSummaryRow && options.rows.summaryTop", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    columns: EXAMPLE_COLUMNS,
                    viewColumns: EXAMPLE_COLUMNS.map(c => true),
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            showSummaryRow: true,
                            summaryTop: true
                        }
                    }
                }}
            >
                <MUITableHead />
            </MUITableTestContext>
        );
        const test = () => getByText("SUMMARY");
        expect(test).not.toThrow();
    });
});
