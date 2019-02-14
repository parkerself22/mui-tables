import React from "react";
import { cleanup, fireEvent, render } from "react-testing-library";
import sinon from "sinon";
import MUITablePagination from "../../../src/components/Footer/MUITablePagination";
import { DEFAULT_CONTEXT, DEFAULT_OPTS } from "../../../src/constants";
import { EXAMPLE_ROWS, MUITableTestContext } from "../../utils";

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

describe("MUITablePagination", () => {
    test("renders null if options.display.paginate = false", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: false
                        }
                    }
                }}
            >
                <MUITablePagination />
            </MUITableTestContext>
        );
        const test = () => getByText("Rows per page:");
        expect(test).toThrow();
    });

    test("handles next page click", () => {
        const changePage = sandbox.spy();
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    changePage,
                    displayRows: EXAMPLE_ROWS,
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: true
                        },
                        pagination: {
                            rowsPerPage: 1
                        }
                    }
                }}
            >
                <MUITablePagination />
            </MUITableTestContext>
        );
        const button = getByTestId("Next Page");
        fireEvent.click(button);
        expect(changePage.called).toBe(true);
        expect(changePage.calledWith(1)).toBe(true);
    });
    test("handles previous page click", () => {
        const changePage = sandbox.spy();
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    changePage,
                    displayRows: EXAMPLE_ROWS,
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: true
                        }
                    },
                    pagination: {
                        ...DEFAULT_CONTEXT.pagination,
                        rowsPerPage: 1,
                        page: 1
                    }
                }}
            >
                <MUITablePagination />
            </MUITableTestContext>
        );
        const prev = getByTestId("Previous Page");
        fireEvent.click(prev);
        expect(changePage.called).toBe(true);
        expect(changePage.calledWith(0)).toBe(true);
    });
    test("handles last page click", () => {
        const changePage = sandbox.spy();
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    changePage,
                    displayRows: EXAMPLE_ROWS,
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: true
                        }
                    },
                    pagination: {
                        ...DEFAULT_CONTEXT.pagination,
                        rowsPerPage: 1,
                        page: 0
                    }
                }}
            >
                <MUITablePagination />
            </MUITableTestContext>
        );
        const last = getByTestId("Last Page");
        fireEvent.click(last);
        expect(changePage.called).toBe(true);
        expect(changePage.calledWith(EXAMPLE_ROWS.length)).toBe(true);
    });
    test("handles first page click", () => {
        const changePage = sandbox.spy();
        const { getByTestId } = render(
            <MUITableTestContext
                override={{
                    changePage,
                    displayRows: EXAMPLE_ROWS,
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: true
                        }
                    },
                    pagination: {
                        ...DEFAULT_CONTEXT.pagination,
                        rowsPerPage: 1,
                        page: EXAMPLE_ROWS.length - 1
                    }
                }}
            >
                <MUITablePagination />
            </MUITableTestContext>
        );
        const last = getByTestId("First Page");
        fireEvent.click(last);
        expect(changePage.called).toBe(true);
        expect(changePage.calledWith(0)).toBe(true);
    });
    test("changeRowsPerPage", () => {
        const changeRowsPerPage = sandbox.spy();
        let r: any;
        const { getByValue, getByTitle, getAllByRole } = render(
            <MUITableTestContext
                override={{
                    changeRowsPerPage,
                    displayRows: EXAMPLE_ROWS,
                    options: {
                        ...DEFAULT_OPTS,
                        display: {
                            ...DEFAULT_OPTS.display,
                            paginate: true
                        }
                    },
                    pagination: {
                        ...DEFAULT_CONTEXT.pagination,
                        rowsPerPage: 69
                    }
                }}
            >
                <MUITablePagination
                    innerRef={(ref: any) => {
                        r = ref;
                    }}
                />
            </MUITableTestContext>
        );
        // @ts-ignore
        const perPageInput = getByTitle("MUITable-rowsPerPageSelect").firstChild.firstChild;
        fireEvent.click(perPageInput as any);
        const option = getAllByRole("option");
        option[0].click();
        expect(changeRowsPerPage.called).toBe(true);
    });
});
