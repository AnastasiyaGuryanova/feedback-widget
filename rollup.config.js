import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/widget.js",
    format: "iife",
    name: "FeedbackWidget",
    sourcemap: false,
    inlineDynamicImports: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      extensions: [".css", ".scss"],
      extract: false,
      minimize: true,
      sourceMap: false,
      use: ["sass"],
    }),
    terser(),
  ],
};
