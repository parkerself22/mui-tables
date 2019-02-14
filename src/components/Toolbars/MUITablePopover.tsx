import MuiPopover, { PopoverActions, PopoverOrigin, PopoverProps } from '@material-ui/core/Popover';
import React, { ReactElement, ReactNode } from 'react';
import { findDOMNode } from 'react-dom';

export interface MUITablePopoverState {
    open: boolean;
}

export interface MUITablePopoverProps extends PopoverProps {
    trigger: ReactElement<any, any>;
    refClose?: (cb: any) => void;
    refExit?: any;
    content: ReactNode;
}

class MUITablePopover extends React.Component<MUITablePopoverProps, MUITablePopoverState> {
    constructor(props: MUITablePopoverProps) {
        super(props);
        this.state = {
            open: !!props.open
        };
    }

    anchorEl: null | any = null;
    popoverActions: null | PopoverActions = null;

    componentWillMount() {
        this.anchorEl = null;
    }

    componentDidMount() {
        if (this.props.refClose) {
            this.props.refClose(this.handleRequestClose);
        }
    }

    componentDidUpdate(prevProps: MUITablePopoverProps, prevState: MUITablePopoverState) {
        /*
         * Update Popover position if a filter removes data from the table because
         * it affects the window height which would cause the Popover to in the wrong place
         */
        if (this.state.open === true) {
            if (this.anchorEl) {
                this.anchorEl = findDOMNode(this.anchorEl);
            }
            if (this.popoverActions) {
                this.popoverActions.updatePosition();
            }
        }
    }

    handleClick = () => {
        if (this.anchorEl) {
            this.anchorEl = findDOMNode(this.anchorEl);
        }
        this.setState({ open: true });
    };

    handleRequestClose = (cb: any) => {
        this.setState({ open: false }, () => {
            cb && typeof cb === 'function' ? cb() : null;
        });
    };

    handleOnExit = () => {
        if (this.props.refExit) {
            this.props.refExit();
        }
    };

    render() {
        const { trigger, content, open } = this.props;

        const transformOriginSpecs: PopoverOrigin = {
            vertical: 'top',
            horizontal: 'center'
        };

        const anchorOriginSpecs: PopoverOrigin = {
            vertical: 'bottom' as 'bottom',
            horizontal: 'center' as 'center'
        };

        const triggerEl = React.cloneElement(trigger, {
            key: 'content',
            ref: (el: ReactElement<any, any>) => (this.anchorEl = el),
            onClick: () => {
                if (trigger.props.onClick) {
                    trigger.props.onClick();
                }
                this.handleClick();
            }
        });

        return (
            <React.Fragment>
                <MuiPopover
                    action={actions => (this.popoverActions = actions)}
                    elevation={2}
                    open={open && this.state.open}
                    onClose={this.handleRequestClose}
                    onExited={this.handleOnExit}
                    anchorEl={this.anchorEl}
                    anchorOrigin={anchorOriginSpecs}
                    transformOrigin={transformOriginSpecs}
                >
                    {content}
                </MuiPopover>
                {triggerEl}
            </React.Fragment>
        );
    }
}
export default MUITablePopover;
