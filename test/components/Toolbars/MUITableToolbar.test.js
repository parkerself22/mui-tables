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
var MUITable_1 = require("../../../src/components/MUITable");
var MUITableToolbar_1 = require("../../../src/components/Toolbars/MUITableToolbar");
var constants_1 = require("../../../src/constants");
var utils_1 = require("../../utils");
var sandbox = sinon_1["default"].createSandbox();
afterEach(react_testing_library_1.cleanup);
afterAll(sandbox.restore);
var ToolbarInstance = function () {
    var context = MUITable_1.useMUITableContext();
    return <MUITableToolbar_1["default"] context={context}/>;
};
describe('MUITableToolbar', function () {
    test('renders', function () {
        var testFn = function () {
            return react_testing_library_1.render(<utils_1.MUITableTestContext>
                    <ToolbarInstance />
                </utils_1.MUITableTestContext>);
        };
        expect(testFn).not.toThrow();
    });
    test('renders fixedSearch', function () {
        var getByTestId = react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: [],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { display: __assign({}, constants_1.DEFAULT_OPTS.display, { fixedSearch: true }) })
        }}>
                <ToolbarInstance />
            </utils_1.MUITableTestContext>).getByTestId;
        var test = function () { return getByTestId('FixedSearch'); };
        expect(test).not.toThrow();
    });
    test('renders customToolbarFull', function () {
        var customToolbarFull = sandbox.spy();
        react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: [],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { toolbar: __assign({}, constants_1.DEFAULT_CONTEXT.options.toolbar, { customToolbarFull: customToolbarFull }) })
        }}>
                <ToolbarInstance />
            </utils_1.MUITableTestContext>);
        expect(customToolbarFull.called).toBe(true);
    });
    test('renders customToolbarLeft', function () {
        var customToolbarLeft = sandbox.spy();
        react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: [],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { toolbar: __assign({}, constants_1.DEFAULT_CONTEXT.options.toolbar, { customToolbarLeft: customToolbarLeft }) })
        }}>
                <ToolbarInstance />
            </utils_1.MUITableTestContext>);
        expect(customToolbarLeft.called).toBe(true);
    });
    test('renders customToolbarBottom', function () {
        var customToolbarBottom = sandbox.spy();
        react_testing_library_1.render(<utils_1.MUITableTestContext override={{
            selectedRows: [],
            options: __assign({}, constants_1.DEFAULT_CONTEXT.options, { toolbar: __assign({}, constants_1.DEFAULT_CONTEXT.options.toolbar, { customToolbarBottom: customToolbarBottom }) })
        }}>
                <ToolbarInstance />
            </utils_1.MUITableTestContext>);
        expect(customToolbarBottom.called).toBe(true);
    });
});
