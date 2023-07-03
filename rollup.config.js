const { uglify } = require('rollup-plugin-uglify')
const { default: dts } = require('rollup-plugin-dts')
const typescript = require('@rollup/plugin-typescript')
const externals = require('rollup-plugin-node-externals')

const prod = process.env.NODE_ENV === 'production'

/**
 * @type {Array<import('rollup').RollupOptions.plugins>}
 */
const plugins = [
  typescript(),
  externals({
    deps: true,
    devDeps: true,
    optDeps: true,
    peerDeps: true
  }),
  prod &&
    uglify({
      toplevel: true,
      warnings: true
    })
]

/**
 * @type {Array<import('rollup').RollupOptions>}
 */
const config = [
  {
    input: './src/index.ts',
    output: [
      {
        file: './dist/index.cjs.js',
        format: 'cjs',
        exports: 'named',
        sourcemap: true
      },
      {
        file: './dist/index.esm.js',
        format: 'esm',
        exports: 'named',
        sourcemap: true
      }
    ],
    plugins
  }
]

if (prod) {
  config.push({
    input: './src/index.ts',
    output: {
      file: './dist/index.d.ts',
      format: 'esm'
    },
    plugins: [dts()]
  })
}

module.exports = config
