import React from "react";
import { cleanup, render, fireEvent } from "react-testing-library";
import MUITableBodyCell from "../../../src/components/Body/MUITableBodyCell";
import MUITableSelectCell from "../../../src/components/Body/MUITableSelectCell";
import { DEFAULT_COL, DEFAULT_CONTEXT, DEFAULT_OPTS } from "../../../src/constants";
import { MUITableTestContext } from "../../utils";
import sinon from "sinon";
const sandbox = sinon.createSandbox();
afterEach(cleanup);
describe("MUITableBodyCell", () => {
    test("renders cell if rows are selectable", () => {
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            selectable: true
                        }
                    }
                }}
            >
                <MUITableSelectCell testId={"testSelectCell"} checked={true} isHeaderCell={true} />
            </MUITableTestContext>
        );
        expect(() => getByTestId("testSelectCell")).not.toThrow();
    });
    test("returns null if rows are not selectable", () => {
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            selectable: false
                        }
                    }
                }}
            >
                <MUITableSelectCell testId={"testSelectCell"} checked={true} isHeaderCell={true} />
            </MUITableTestContext>
        );
        expect(() => getByTestId("testSelectCell")).toThrow();
    });
    test("calls handleAllSelect if isHeaderCell", () => {
        const handleAllSelect = sandbox.spy(() => {});
        const { getByTestId, baseElement, container } = render(
            <MUITableTestContext
                override={{
                    handleAllSelect,
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            selectable: true
                        }
                    }
                }}
            >
                <MUITableSelectCell testId={"testSelectCell"} checked={true} isHeaderCell={true} />
            </MUITableTestContext>
        );
        const checkbox = getByTestId("testSelectCell");
        const inputs = checkbox.getElementsByTagName("input");
        fireEvent.click(inputs.item(0) as any);
        expect(handleAllSelect.called).toBe(true);
    });
    test("calls toggleRowSelected if !isHeaderCell", () => {
        const toggleRowSelected = sandbox.spy(() => {});
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    toggleRowSelected,
                    options: {
                        ...DEFAULT_OPTS,
                        rows: {
                            ...DEFAULT_OPTS.rows,
                            selectable: true
                        }
                    }
                }}
            >
                <MUITableSelectCell
                    testId={"testSelectCell"}
                    checked={true}
                    isHeaderCell={false}
                    row={{} as any}
                />
            </MUITableTestContext>
        );
        const checkbox = getByTestId("testSelectCell");
        const inputs = checkbox.getElementsByTagName("input");
        fireEvent.click(inputs.item(0) as any);
        expect(toggleRowSelected.called).toBe(true);
    });
});
