const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

process.env.NX_TASK_TARGET_PROJECT ??= 'user-access';
process.env.NX_TASK_TARGET_TARGET ??= 'build';
if (process.env.NODE_ENV === 'development') {
  process.env.NX_TASK_TARGET_CONFIGURATION ??= 'development';
}

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/user-access'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMap: true,
    }),
  ],
};
