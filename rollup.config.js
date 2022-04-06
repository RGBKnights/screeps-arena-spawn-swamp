"use strict";

import clear from "rollup-plugin-clear";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
//import commonjs from "@rollup/plugin-commonjs";
// import { babel } from '@rollup/plugin-babel';

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
    typescript({ tsconfig: "./tsconfig.json" }),
  ]
}