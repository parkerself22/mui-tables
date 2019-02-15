import depcheck from 'depcheck';
import path from 'path';

const options = {
    withoutDev: true, // [DEPRECATED] check against devDependencies
    ignoreBinPackage: false, // ignore the packages with bin entry
    skipMissing: false, // skip calculation of missing dependencies
    ignoreDirs: [
        // folder with these names will be ignored
        'dist',
        'test',
        'config',
        'scripts',
        'examples',
        '.storybook'
    ],
    ignoreMatches: [
        // ignore dependencies that matches these globs
        '@babel/*',
        'babel-*',
        '@semantic-release/*',
        '@storybook/*',
        '@types/*',
        'webpack*',
        'codecov',
        'enzyme*',
        'ts*',
        'jest*',
        'pre-*',
        'react*'
    ],
    parsers: {
        // the target parsers
        '*.js': depcheck.parser.jsx,
        '*.jsx': depcheck.parser.jsx,
        '*.ts': depcheck.parser.typescript,
        '*.tsx': depcheck.parser.typescript
    },
    detectors: [
        // the target detectors
        depcheck.detector.requireCallExpression,
        depcheck.detector.requireResolveCallExpression,
        depcheck.detector.importDeclaration
    ],
    specials: [
        // the target special parsers
        depcheck.special.bin,
        depcheck.special.webpack,
        depcheck.special.babel,
        depcheck.special.mocha,
        depcheck.special.eslint
    ]
};

jest.setTimeout(10000);
test('Dependencies', async () => {
    const rootDir = path.resolve(__dirname, '../');
    const unused = await depcheck(rootDir, options);
    console.warn(unused.dependencies); // an array containing the unused dependencies
    console.warn(unused.devDependencies); // an array containing the unused devDependencies
    console.log(unused.missing); // a lookup containing the dependencies missing in `package.json`
    console.log(unused.using); // a lookup indicating each dependency is used by which files
    console.log(unused.invalidFiles); // files that cannot access or parse
    console.log(unused.invalidDirs); // directories that cannot access
    expect(Object.values(unused.missing)).toHaveLength(0);
}, 20000);
