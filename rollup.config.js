import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import { promises as fs } from 'fs';
import path from 'path';
import postcss from "rollup-plugin-postcss";

const getPackageJson = async () => {
  const jsonPath = path.resolve('./package.json');
  const jsonData = await fs.readFile(jsonPath, 'utf-8');
  return JSON.parse(jsonData);
};

export default (async () => {
  const packageJson = await getPackageJson();

  return [
    {
      input: "src/index.ts",
      output: [
        {
          file: packageJson.main,
          format: "cjs",
          sourcemap: true,
        },
        {
          file: packageJson.module,
          format: "esm",
          sourcemap: true,
        },
      ],
      external: ['tslib'],
      plugins: [
        resolve(),
        commonjs(),
        typescript({ tsconfig: "./tsconfig.json" }),
        postcss(), 
      ],
    },
    {
      input: "dist/esm/types/index.d.ts",
      output: [{ file: "dist/index.d.ts", format: "esm" }],
      plugins: [dts()],
      external: [/\.css$/],
    },
  ];
})();
