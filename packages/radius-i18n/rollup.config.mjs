import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import  terser  from "@rollup/plugin-terser";
import copy from 'rollup-plugin-copy'
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json'; 
import { builtinModules } from 'module';

export default {
  input: 'src/bin/index.ts', 
  output: [
    {
      dir: 'dist',  
      format: 'esm', 
      preserveModules: true,  
      preserveModulesRoot: 'src',  
      entryFileNames: '[name].mjs',
    }
  ],
  external: [
    ...builtinModules,
    /node_modules/
  ],
  plugins: [
    commonjs(),
    resolve({preferBuiltins: true, browser: false}), 
    typescript({ tsconfig: './tsconfig.json' }), 
    json(), 
    terser(),
    copy({
      targets: [
        { src: "src/instructions/*", dest: "dist/instructions" }
      ]
    })
  ],
};
