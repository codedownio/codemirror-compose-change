
import camelCase from "lodash.camelcase";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";

const libraryName = "codemirror-compose-change";

export default {
  input: `src/${libraryName}.ts`,
  output: [
    { file: "dist/index.umd.js", name: camelCase(libraryName), format: "umd", sourcemap: true },
    { file: "dist/index.es5.js", format: "es", sourcemap: true },
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: "lodash")
  external: [
    // "lodash-es"
  ],
  watch: {
    include: "src/**",
  },
  plugins: [
    // Allow json resolution
    json(),
    // Compile TypeScript files
    typescript({ useTsconfigDeclarationDir: true }),
    // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
    commonjs(),
    // Allow node_modules resolution, so you can use "external" to control
    // which external modules to include in the bundle
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Resolve source maps to the original source
    // sourceMaps(),
  ],
};
