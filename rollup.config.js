import replace from '@rollup/plugin-replace'
import postcss from 'rollup-plugin-postcss'
import styles from 'rollup-plugin-styles'

export default {
  input: './public/css/index.css',

  output: [
    {
      dir: './public',
    },
  ],

  plugins: [
    styles({
      mode: 'emit',
    }),
    replace({
      delimiters: ['', ''],
      preventAssignment: false,
      'url("./': 'url("/assets/',
      "url('./": "url('/assets/",
    }),
    postcss({
      extract: 'index.bundle.css',
    }),
  ],
}
