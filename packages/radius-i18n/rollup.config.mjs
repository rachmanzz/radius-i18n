import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import  terser  from "@rollup/plugin-terser";
import copy from 'rollup-plugin-copy'
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'; 

export default {
  input: 'src/bin/index.ts', // Specify the input file here
  output: [
    {
      dir: 'dist',  // Output directory
      format: 'esm',  // ES Module format
      preserveModules: true,  // Keep modules separated
      preserveModulesRoot: 'src',  // Maintain the structure
      entryFileNames: '[name].mjs',  // Add this line to ensure the file extension is .mjs
    }
  ],
  external: ['google-auth-library', 'navigator', 'window', 'document'],
  plugins: [
    commonjs(),
    resolve({preferBuiltins: true, browser: false}),  // Resolves external dependencies
    typescript({ tsconfig: './tsconfig.json' }),  // TypeScript plugin,
    json(), 
    terser(),
    copy({
      targets: [
        { src: "src/instructions/*", dest: "dist/instructions" }
      ]
    })
  ],
};
