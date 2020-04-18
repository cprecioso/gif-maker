// @ts-check

import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import ts from "@wessberg/rollup-plugin-ts"
import nodeBuiltins from "rollup-plugin-node-builtins"
import nodeGlobals from "rollup-plugin-node-globals"

const defaultPlugins = (/** @type {boolean} */ withDeclaration) => [
  commonjs(),
  nodeGlobals(),
  nodeBuiltins(),
  nodeResolve({ browser: true }),
  ts({ typescript: require("typescript") }),
]

export default /** @type {import("rollup").RollupOptions[]} */ ([
  {
    input: "src/main.ts",
    output: { file: "main.js", format: "cjs" },
    plugins: [...defaultPlugins(true)],
  },
  {
    input: "src/gif.worker.ts",
    output: { file: "gif.worker.js", format: "cjs" },
    plugins: [...defaultPlugins(false)],
  },
])
