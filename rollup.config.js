import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import styles from 'rollup-plugin-styles'

export default [
  {
    input: './static/scripts/index.js',

    output: [
      {
        file: './static/scripts/index.bundle.js',
        format: 'iife',
      },
    ],

    plugins: [nodeResolve()],

    watch: {
      include: './static/scripts/**',
    },
  },
  {
    input: './static/css/index.css',

    output: [
      {
        dir: './static',
      },
    ],

    plugins: [
      styles({
        mode: 'emit',
      }),
      replace({
        delimiters: ['', ''],
        preventAssignment: false,
        'url("./': 'url("/static/assets/',
        "url('./": "url('/static/assets/",
      }),
      postcss({
        extract: 'css/index.bundle.css',
      }),
    ],

    watch: {
      include: './static/css/**',
    },
  },
]
