import React from 'react';
import { cleanup, fireEvent, render, wait } from 'react-testing-library';
import sinon from 'sinon';
import MUITableDatePicker from '../../../src/components/Toolbars/MUITableDatePicker';
import { DEFAULT_CONTEXT } from '../../../src/constants';
import { MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();

afterEach(cleanup);
afterAll(sandbox.restore);

describe("MUITableDatePicker", () => {
    test("returns null when !displayDates && !customToolbarRight", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            showDates: false,
                            customToolbar: undefined
                        }
                    }
                }}
            >
                <MUITableDatePicker />
            </MUITableTestContext>
        );
        const test = () => getByText("Start Date");
        expect(test).toThrow();
    });
    test("throws an error if showDates = true but no handler provided", () => {
        const test = () =>
            render(
                <MUITableTestContext
                    override={{
                        options: {
                            ...DEFAULT_CONTEXT.options,
                            toolbar: {
                                ...DEFAULT_CONTEXT.options.toolbar,
                                showDates: true
                            }
                        }
                    }}
                >
                    <MUITableDatePicker />
                </MUITableTestContext>
            );
        expect(test).toThrow();
    });
    test("calls and renders customToolbarRight()", () => {
        const spy = sandbox.spy(() => "TEST");
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            showDates: false,
                            customToolbarRight: spy
                        }
                    }
                }}
            >
                <MUITableDatePicker />
            </MUITableTestContext>
        );
        expect(() => getByText("TEST")).not.toThrow();
        expect(spy.called).toBe(true);
    });
    test("hides dates if not provided", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            showDates: true,
                            handleDateChange: isStart => v => {}
                        }
                    }
                }}
            >
                <MUITableDatePicker />
            </MUITableTestContext>
        );
        expect(() => getByText("Start Date")).toThrow();
        expect(() => getByText("End Date")).toThrow();
    });
    test("uses custom labels if provided dates if not provided", () => {
        const { getByText } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            showDates: true,
                            handleDateChange: isStart => v => {},
                            startDate: new Date(),
                            endDate: new Date(),
                            endLabel: "custom end",
                            startLabel: "custom start"
                        }
                    }
                }}
            >
                <MUITableDatePicker />
            </MUITableTestContext>
        );
        expect(() => getByText("custom end")).not.toThrow();
        expect(() => getByText("custom start")).not.toThrow();
    });
    test("uses dateChange handler", async () => {
        const endSpy = sandbox.spy();
        const startSpy = sandbox.spy();
        const handler = sandbox.spy((isStart: boolean) => {
            return isStart ? startSpy : endSpy;
        });

        const { getByText, container, baseElement } = render(
            <MUITableTestContext
                override={{
                    options: {
                        ...DEFAULT_CONTEXT.options,
                        toolbar: {
                            ...DEFAULT_CONTEXT.options.toolbar,
                            showDates: true,
                            handleDateChange: handler,
                            startDate: new Date("2/11/2019"),
                            endDate: new Date("2/11/2019")
                        }
                    }
                }}
            >
                <MUITableDatePicker />
            </MUITableTestContext>
        );

        const openAndClose = (inputs: any) => {
            for (const i of inputs) {
                fireEvent.click(i);
                if (container.ownerDocument) {
                    const modal = container.ownerDocument.getElementById("picker-popover");
                    if (modal && modal.firstChild) {
                        fireEvent.click(modal.firstChild as any);
                    }
                }
            }
        };

        const endInputs = Array.from(
            container.getElementsByClassName("muiTableToolbar-datePicker-end")
        );
        const startInputs = Array.from(
            container.getElementsByClassName("muiTableToolbar-datePicker-start")
        );
        openAndClose(endInputs);
        await wait(undefined, { timeout: 50 });
        openAndClose(startInputs);
        expect(endSpy.callCount).toBe(1);
        expect(startSpy.callCount).toBe(1);
        expect(handler.callCount).toBe(2);
    });
});
