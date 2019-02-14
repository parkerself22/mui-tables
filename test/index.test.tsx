import spec from "../package.json";

test("package exports", () => {
    const path = spec.main.replace("dist", "src").replace("js", "ts")
    const exports = require(`../${path}`);
    expect(exports.default).not.toBeUndefined();
});
