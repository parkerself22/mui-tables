import React from "react";
import { cleanup, render } from "react-testing-library";
import { MUITableLoader } from "../../../src/components/Head/MUITableLoader";

afterEach(cleanup);

describe("MUITableLoader", () => {
    test("returns null if not loading", () => {
        const result = MUITableLoader({ loading: false });
        expect(result).toBe(null);
    });
    test("doesn't return null if loading", () => {
        const result = MUITableLoader({ loading: true });
        expect(result).not.toBe(null);
    });
});
