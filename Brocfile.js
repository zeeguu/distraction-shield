/* eslint-env node */
// import plugins
const babel = require('broccoli-babel-transpiler');
const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const Concat = require('broccoli-concat');
const Rollup = require('broccoli-rollup');
const CleanCss = require('broccoli-clean-css');

// NPM deps
const path = require('path');
const chalk = require('chalk');
const UI = require('console-ui');
const commandLineArgs = require('command-line-args');

// Rollup plugins
const filesize = require('rollup-plugin-filesize');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const multiEntry = require('rollup-plugin-multi-entry');

// Instantiations
const ui = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout
});
const optionDefinitions = [
  { name: 'env', type: String, defaultValue: ['env', 'development'],
  multiple: true, defaultOption: true }
];
const options = commandLineArgs(optionDefinitions);
const env = options.env.filter((v) =>
  v.includes('env=')).join('').replace('env=', '') || 'development';
const DEV = env === 'development';
const PROD = env === 'production';
const TEST = env === 'test';
const MIN = PROD ? '.min' : '';

// Folder setup
const Project = new Funnel('Distraction Shield');
const Vendor = new Funnel('bower_components');
const Test = new Funnel('test');

// Build
let build = [];
ui.writeLine(chalk.blue(`Building ${env} project`));
ui.startProgress('Constructing pipeline...');

/* HTML */
if (!TEST) {
  let project = new Funnel(Project, {
    include: [ '**/*.html' ],
    getDestinationPath: (file) => `assets/html/${path.basename(file)}`
  });
  build.push(project);
}

/* JS */
let rollup = (tree, entry, dest, format = 'es') => {
  return new Rollup(tree, {
    rollup: {
      format,
      entry,
      dest,
      external: [ 'ava', 'sinon', 'sinon-chrome' ],
      sourceMap: PROD ? true : 'inline',
      plugins: [
        filesize(),
        resolve(),
        commonjs({
          include: 'node_modules/**',
          sourceMap: true,
          namedExports: {
            [`node_modules/jquery/dist/jquery${MIN}.js`]: [ 'jquery' ]
          }
        }),
        multiEntry()
      ]
    }
  });
};
let transpile = (tree) => {
  return babel(tree, {
    presets: [ 'env' ],
    sourceMaps: PROD ? true : 'inline',
    minified: PROD
  });
};
let jscomp = (tree, entry, dest, format) =>
  transpile(rollup(tree, entry, dest, format));

if (!TEST) {
  build.push(jscomp(Project, 'init.js', 'assets/js/init.js'));
  build.push(jscomp(Project, 'optionsPage/options.js', 'assets/js/options.js'));
  build.push(jscomp(Project, 'tooltipPage/tooltip.js', 'assets/js/tooltip.js'));
  build.push(jscomp(Project, 'statisticsPage/statistics.js', 'assets/js/statistics.js'));
  build.push(jscomp(Project, 'contentInjection/inject.js', 'assets/js/inject.js'));
  build.push(jscomp(Project, 'introTour/introTour.js', 'assets/js/introTour.js'));
}

if (DEV || TEST) {
  build.push(jscomp(Merge([ Project, Test ]), '**/*-test.js', 'tests.js'));
}

if (!TEST) {
  let vendorJs = new Concat(Vendor, {
    inputFiles: [
      `bootstrap/dist/js/bootstrap${MIN}.js`,
      `bootstrap-tour/build/js/bootstrap-tour${MIN}.js`,
      `jquery/dist/jquery${MIN}.js`
    ],
    outputFile: 'assets/js/vendor.js',
    headerFiles: [`jquery/dist/jquery${MIN}.js`] // include jquery before bootstrap
  });
  build.push(vendorJs);
}

/* CSS */
if (!TEST) {
  let project = new Funnel(Project, {
    include: ['**/*.css']
  });
  if (PROD) project = new CleanCss(project);
  let vendor = new Funnel(Vendor, {
    include: [
      `**/*/bootstrap${MIN}.css`,
      `**/*/bootstrap-tour${MIN}.css`
    ]
  });

  let css;
  css = Merge([ project, vendor ]);
  css = new Concat(css, {
    inputFiles: ['**/*.css'],
    outputFile: 'assets/css/distraction-shield.css'
  });
  build.push(css);
}

/* Static assets */
if (!TEST) {
  // project images
  let project = new Funnel(Project, {
    destDir: 'assets/images',
    include: ['**/*.png'],
    getDestinationPath: (file) => path.basename(file)
  });
  build.push(project);

  // manifest
  let manifest = new Funnel(Project, {
    include: ['manifest.json']
  });
  build.push(manifest);

  // bower assets
  let vendor = new Funnel(Vendor, {
    srcDir: 'bootstrap/dist',
    destDir: 'assets',
    include: ['**/*/glyphicons-*']
  });
  build.push(vendor);
}

ui.stopProgress();
ui.writeLine(chalk.green(`Pipeline constructed. Building...`));

module.exports = new Merge(build);
