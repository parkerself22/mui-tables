import React from 'react';
import { cleanup, render } from 'react-testing-library';
import sinon from 'sinon';
import MUITableBodyRow from '../../../src/components/Body/MUITableBodyRow';
import { MUITableTestContext } from '../../utils';

const sandbox = sinon.createSandbox();
afterEach(cleanup);
afterAll(sandbox.restore);

describe("MUITableBodyRow", () => {
    test("returns an empty row when no display rows exist", () => {
        const { getByText } = render(
            <MUITableTestContext override={{ displayRows: [] }}>
                <MUITableBodyRow index={0}>Test</MUITableBodyRow>
            </MUITableTestContext>
        );
        expect(() => getByText("Test")).not.toThrow();
    });
});
