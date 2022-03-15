"use strict";

import clear from "rollup-plugin-clear";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";

let externals = [
  "game", 
  "game/prototypes",
  "game/constants", 
  "game/utils", 
  "game/path-finder", 
  "game/visual", 
  "arena"
]

export default {
  input: "src/main.ts",
  external: externals,
  output: {
    file: 'dist/main.mjs',
    paths: (path) => {
      return externals.includes(path) ? "/" + path : path;
    }
  },
  plugins: [
    clear({ targets: ["dist"]}),
    resolve({ rootDir: "src"}),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" })
  ]
}