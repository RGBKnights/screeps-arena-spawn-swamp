# Screeps Arena

## Spawn & Swamp

A Screeps Arena setup with Typescript, Jest for testing, Rollup for bundling, ESLint for static code analysis, and Prettier for an opinionated code formatter.

// Strategies:
// MARCO
// 1. Produce Units
// Plan Construction: Extsions | Spawns | Towers | Ramprats
// MICRO
// 1. Control Sqauds
// Postion Planing: Advament / Iterception / Retreat
// 2. Control Units
// Targeting
// Postion Planing: Formations

## Script Usage

```powershell
# Complie Typescript for quick type checking
npm run check

# Static code analysis with automatic fixing using ESLint based on the rules defined in '.eslintrc.js'.
npm run lint

# Code formatter with automatic fixing using Prettier based on the rules defined in '.prettierrc'.
npm run format

# Unit testing with Jest. Mocks modules have been creating for the (game and arena) externals: 'prototypes', 'constants', 'utils', 'path-finder', 'visual', and 'arena'.
npm run test

# Bundle using the rollup with the following steps: eslint (lints the source code), clear (clears the output directory), resolve (node_modules), commonjs (convert CommonJS modules to ES), typescript (complie typescript as part of rollup), rename (Rename node_modules paths relative to the root of the output folder).
npm run bundle

# Build runs test then bundle commands.
npm run build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
