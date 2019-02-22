import spec from "../package.json";
import MUITable, { MUITableUtils, MUITableDefaults } from '../src';

test("package exports", () => {
    const path = spec.main.replace("dist", "src").replace("js", "ts");
    const exports = require(`../${path}`);
    expect(exports.default).not.toBeUndefined();
    expect(MUITable).not.toBeUndefined();
    expect(MUITableUtils).not.toBeUndefined();
    expect(MUITableDefaults).toHaveProperty("context");
    expect(MUITableDefaults).toHaveProperty("props");
    expect(MUITableDefaults).toHaveProperty("column");
});
