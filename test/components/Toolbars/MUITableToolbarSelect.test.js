"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var react_testing_library_1 = require("react-testing-library");
var sinon_1 = require("sinon");
var src_1 = require("../../../src");
var MUITableToolbarSelect_1 = require("../../../src/components/Toolbars/MUITableToolbarSelect");
var constants_1 = require("../../../src/constants");
var utils_1 = require("../../utils");
var sandbox = sinon_1["default"].createSandbox();
afterEach(react_testing_library_1.cleanup);
afterAll(sandbox.restore);
describe('MUITableToolbarSelect', function () {
    test('renders', function () {
        var testFn = function () { return react_testing_library_1.render(<MUITableToolbarSelect_1["default"] />); };
        expect(testFn).not.toThrow();
    });
    test('renders customToolbarSelect if exists', function () {
        var customToolbarSelect = sandbox.spy();
        react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: ["1"],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { rows: __assign({}, constants_1.DEFAULT_CONTEXT.options.rows, { customToolbarSelect: customToolbarSelect }) })
        }}>
                <MUITableToolbarSelect_1["default"] />
            </utils_1.MUITableTestContext>);
        expect(customToolbarSelect.called).toBe(true);
    });
    test('renders customToolbarSelect if !selectBarTop', function () {
        var customToolbarSelect = sandbox.spy();
        react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: ["1"],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { rows: __assign({}, constants_1.DEFAULT_CONTEXT.options.rows, { customToolbarSelect: customToolbarSelect, selectBarTop: false }) })
        }}>
                <MUITableToolbarSelect_1["default"] />
            </utils_1.MUITableTestContext>);
        expect(customToolbarSelect.called).toBe(true);
    });
    test('renders selectBarActions if provided', function () {
        var selectBarActions = sandbox.spy();
        react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: ["1"],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { rows: __assign({}, constants_1.DEFAULT_CONTEXT.options.rows, { selectBarActions: selectBarActions, selectBarTop: false }) })
        }}>
                <MUITableToolbarSelect_1["default"] />
            </utils_1.MUITableTestContext>);
        expect(selectBarActions.called).toBe(true);
    });
    test('does not render delete button if hideSelectDelete', function () {
        var _a = react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: ["1"],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { rows: __assign({}, constants_1.DEFAULT_CONTEXT.options.rows, { selectBarTop: false, hideSelectDelete: true }) })
        }}>
                <MUITableToolbarSelect_1["default"] />
            </utils_1.MUITableTestContext>), getByTitle = _a.getByTitle, getByRole = _a.getByRole;
        var test = function () { return getByTitle("Delete"); };
        var test2 = function () { return getByRole("select-toolbar"); };
        expect(test).toThrow();
        expect(test2).not.toThrow();
    });
    test('renders delete button if !hideSelectDelete', function () {
        var customToolbarSelect = sandbox.spy();
        var _a = react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: ["1"],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { rows: __assign({}, constants_1.DEFAULT_CONTEXT.options.rows, { selectBarTop: false, hideSelectDelete: false }) })
        }}>
                <MUITableToolbarSelect_1["default"] />
            </utils_1.MUITableTestContext>), getByTitle = _a.getByTitle, getByRole = _a.getByRole;
        var test = function () { return getByTitle("Delete"); };
        var test2 = function () { return getByRole("select-toolbar"); };
        expect(test).not.toThrow();
        expect(test2).not.toThrow();
    });
    test('filters for selectedRows on customToolbarSelect', function () {
        var customToolbarSelect = sandbox.spy();
        react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { rows: __assign({}, constants_1.DEFAULT_CONTEXT.options.rows, { customToolbarSelect: customToolbarSelect }) }),
            rows: src_1.MUITableUtils.buildRows(utils_1.EXAMPLE_INPUT_DATA, utils_1.EXAMPLE_COLUMNS, constants_1.DEFAULT_OPTS),
            selectedRows: ['blah-blah-blah']
        }}>
                <MUITableToolbarSelect_1["default"] />
            </utils_1.MUITableTestContext>);
        expect(customToolbarSelect.called).toBe(true);
        expect(customToolbarSelect.args[0][0].length).toBe(0);
    });
    test('default context bs', function () {
        var testFn = function () { return constants_1.DEFAULT_CONTEXT.getVisibleColumns(); };
        expect(testFn).not.toThrow();
    });
});
