import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";
import { cleanup, fireEvent, render } from "react-testing-library";
import sinon from "sinon";
import MUITablePopover, {
    MUITablePopoverProps
} from "../../../src/components/Toolbars/MUITablePopover";
import { Optional } from "../../../src/types";

const sandbox = sinon.createSandbox();

afterEach(cleanup);

function popoverInstance(props?: Optional<MUITablePopoverProps>): MUITablePopover {
    const defaultProps: MUITablePopoverProps = {
        trigger: <span>test</span>,
        content: <span>test</span>,
        open: true,
        ...props
    };
    const renderer = ShallowRenderer.createRenderer();
    renderer.render(<MUITablePopover {...defaultProps} />);
    const instance = renderer.getMountedInstance();
    return instance as MUITablePopover;
}

describe("MUITablePopover", () => {
    test("handles trigger onClick", () => {
        const onClick = sandbox.spy();
        const props: MUITablePopoverProps = {
            trigger: <span onClick={onClick} data-testid="MUITablePopoverTrigger">test</span>,
            content: <span>test</span>,
            open: true
        };
        const { getByTestId } = render(<MUITablePopover {...props} />);
        const trigger = getByTestId("MUITablePopoverTrigger");
        fireEvent.click(trigger);
        expect(onClick.called).toBe(true);
    });
    test("handleRequestClose", () => {
       const instance = popoverInstance();
       const testFn = () => instance.handleRequestClose(() => {});
       expect(testFn).not.toThrow()
    });
    test("handleOnExit", () => {
        const refExit = sandbox.spy();
       const instance = popoverInstance({ refExit });
       const testFn = () => instance.handleOnExit();
       expect(testFn).not.toThrow();
       expect(refExit.called).toBe(true);
    });
});
