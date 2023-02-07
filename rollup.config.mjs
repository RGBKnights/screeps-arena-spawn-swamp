import clear from 'rollup-plugin-clear';
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import renameNodeModules from "@pixi/rollup-plugin-rename-node-modules";
import eslint from '@rollup/plugin-eslint';

// Library code provided by the game engine is not bundled.
let externals = [
  "game",
  "game/prototypes",
  "game/constants",
  "game/utils",
  "game/path-finder",
  "game/visual",
  "arena"
];

const config = [
{
  input: 'src/main.ts',
  external:  externals,
  output: {
    // Output Directory
    dir: "dist/",
    // getting the file name right.
    entryFileNames: "[name].mjs",
    // Output format: ES6 Modules
    format: 'esm',
    // Preserve the folder structure of the source code.
    preserveModules: true,
    // Remove the src folder from the output path by raising everythign within it the root.
    preserveModulesRoot: "src",
    // Import externals dose not work with relative files (Screeps should alias a package in the future)
    paths: (path) => externals.includes(path) ? "/" + path : path,
  },
  plugins: [
    // Lint the source code.
    eslint(),
    // Clear the dist folder by deleting the directory and creating it again.
    clear({ targets: ['dist/'] }),
    // Locate modules using the Node resolution algorithm, for using third party modules in node_modules
    resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    // Convert CommonJS modules to ES6, so they can be included in a Rollup bundle
    commonjs(),
    // Complie TypeScript to JavaScript.
    typescript(),
    // Rename node_modules paths relative to the root of the output folder (node_modules in the output path is invalid).
    renameNodeModules("./", false)
  ]
}
];

export default config;
