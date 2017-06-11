/* eslint-env node */
// import plugins
const babel = require('broccoli-babel-transpiler');
const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const Concat = require('broccoli-concat');
const Rollup = require('broccoli-rollup');

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
const Project = new Funnel('Distraction\ Shield');
const Vendor = new Funnel('bower_components');
const Test = new Funnel('test');

// Build
ui.writeLine(chalk.blue(`Building ${env} project`));
ui.startProgress('Constructing pipeline...');

// TODO broccoli-asset-rev, broccoli-eslint, stfsy/broccoli-livereload

/* HTML */
let html;
{
  let project = new Funnel(Project, {
    include: [ '**/*.html' ],
    getDestinationPath: (file) => `assets/html/${path.basename(file)}`
  });
  html = project;
}

/* JS */
let rollup = (tree, entry, dest, format = 'es') => {
  return new Rollup(tree, {
    rollup: {
      format,
      entry,
      dest,
      external: [ 'ava' ],
      sourceMap: PROD ? false : 'inline',
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
    sourceMaps: PROD ? false : 'inline',
    minified: PROD
  });
};
let jscomp = (tree, entry, dest, format) =>
  transpile(rollup(tree, entry, dest, format));

let jstrees = [
  jscomp(Project, 'init.js', 'assets/js/init.js'),
  jscomp(Project, 'optionsPage/options.js', 'assets/js/options.js'),
  jscomp(Project, 'tooltipPage/tooltip.js', 'assets/js/tooltip.js'),
  jscomp(Project, 'statisticsPage/statistics.js', 'assets/js/statistics.js'),
  jscomp(Project, 'contentInjection/inject.js', 'assets/js/inject.js'),
  jscomp(Project, 'introTour/introTour.js', 'assets/js/introTour.js')
];
if (DEV || TEST)
  jstrees.push(jscomp(Merge([ Project, Test ]), '**/*-test.js', 'tests.js'));
let js = Merge(jstrees);

let vendorJs = new Concat(Vendor, {
  inputFiles: [
    `bootstrap/dist/js/bootstrap${MIN}.js`,
    `bootstrap-tour/build/js/bootstrap-tour${MIN}.js`,
    `jquery/dist/jquery${MIN}.js`
  ],
  outputFile: 'assets/js/vendor.js',
  headerFiles: [`jquery/dist/jquery${MIN}.js`] // include jquery before bootstrap
});

/* CSS */
let css;
{
  let project = Project;
  let vendor = new Funnel(Vendor, {
    include: [
      `**/*/bootstrap${MIN}.css`,
      `**/*/bootstrap-tour${MIN}.css`
    ]
  });

  css = Merge([ project, vendor ]);
  css = new Concat(css, {
    inputFiles: ['**/*.css'],
    outputFile: 'assets/css/distraction-shield.css'
  });
}

/* Static assets */
let assets;
{
  // project images
  let project = new Funnel(Project, {
    destDir: 'assets/images',
    include: ['**/*.png'],
    getDestinationPath: (file) => path.basename(file)
  });

  // manifest
  let manifest = new Funnel(Project, {
    include: ['manifest.json']
  });

  // bower assets
  let vendor = new Funnel(Vendor, {
    srcDir: 'bootstrap/dist',
    destDir: 'assets',
    include: ['**/*/glyphicons-*']
  });

  assets = Merge([ project, manifest, vendor ]);
}

ui.stopProgress();
ui.writeLine(chalk.green(`Pipeline constructed. Building...`));

module.exports = new Merge([ html, js, vendorJs, css, assets ]);
