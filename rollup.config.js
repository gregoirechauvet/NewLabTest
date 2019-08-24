import typescript2 from 'rollup-plugin-typescript2';

module.exports = {
  input: ['src/main.ts'],
  output: {
    format: 'iife',
    dir: 'dist'
  },
  plugins: [
  	typescript2()
  ]
};