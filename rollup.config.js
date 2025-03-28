const autoExternal = require('rollup-plugin-auto-external');
const sourcemaps = require('rollup-plugin-sourcemaps');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const typescript = require('rollup-plugin-typescript2');

const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      interop: 'compat',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [autoExternal({ packagePath: './package.json' }), sourcemaps(), babel(), commonjs(), typescript()],
};

module.exports = config;
