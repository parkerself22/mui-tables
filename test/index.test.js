"use strict";
exports.__esModule = true;
var package_json_1 = require("../package.json");
var src_1 = require("../src");
test("package exports", function () {
    var path = package_json_1["default"].main.replace("dist", "src").replace("js", "ts");
    var exports = require("../" + path);
    expect(exports["default"]).not.toBeUndefined();
    expect(src_1["default"]).not.toBeUndefined();
    expect(src_1.MUITableUtils).not.toBeUndefined();
    expect(src_1.MUITableDefaults).toHaveProperty("context");
    expect(src_1.MUITableDefaults).toHaveProperty("props");
    expect(src_1.MUITableDefaults).toHaveProperty("column");
});
