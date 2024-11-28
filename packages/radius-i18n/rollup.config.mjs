import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/bin/index.ts',
  output: [
    {
      dir: 'dist',  // Output directory
      format: 'esm',  // ES Module format
      preserveModules: true,  // Keep modules separated
      preserveModulesRoot: 'src',  // Maintain the structure
    },
    {
      file: 'dist/bin/index.mjs',  // Output bin file as .mjs
      format: 'esm',  // ES module format
      exports: 'default',  // Export default from the bin file
    },
  ],
  plugins: [
    resolve(),  // Resolves external dependencies
    typescript({ tsconfig: './tsconfig.json' }),  // TypeScript plugin
  ],
};
