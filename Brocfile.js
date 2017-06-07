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

// Rollup plugins
const filesize = require('rollup-plugin-filesize');

// Instantiations
const ui = new UI({
  inputStream: process.stdin,
  outputStream: process.stdout
});

// Folder setup
const Project = new Funnel('Distraction\ Shield');
const Vendor = new Funnel('bower_components');

ui.startProgress('Constructing pipeline...');

// TODO broccoli-asset-rev, broccoli-eslint

/* HTML */
let html;
{
  let project = new Funnel(Project, {
    include: [ '**/*.html' ],
    // exclude: [ '**/*copy.html' ], // FIXME those `copy` files are stupid!
    getDestinationPath: (file) => `${path.basename(file)}`
  });
  html = project;
}

/* JS */
let rollup = (tree, entry, dest) => {
  return new Rollup(tree, {
    inputFiles: ['**/*.js'],
    rollup: {
      format: 'es',
      entry,
      dest,
      sourceMap: 'inline',
      plugins: [ filesize() ]
    }
  });
};
let transpile = (tree) => {
  return babel(tree, {
    presets: [ 'env' ],
    sourceMaps: 'inline',
    browserPolyfill: true
  });
};
let jscomp = (tree, entry, dest) => transpile(rollup(tree, entry, dest));

let js = Merge([
  jscomp(Project, 'init.js', 'assets/js/init.js'),
  jscomp(Project, 'optionsPage/options.js', 'assets/js/options.js'),
  jscomp(Project, 'tooltipPage/tooltip.js', 'assets/js/tooltip.js'),
  jscomp(Project, 'statisticsPage/statistics.js', 'assets/js/statistics.js'),
  jscomp(Project, 'contentInjection/inject.js', 'assets/js/inject.js'),
  jscomp(Project, 'introTour/introTour.js', 'assets/js/introTour.js'),
]);

let allVendorJs = new Funnel(Vendor, {
  include: [
    '**/*/bootstrap.min.js',
    '**/*/bootstrap-tour-standalone.min.js',
    '**/*/jquery.min.js'
  ]
});
let vendorJs = new Concat(allVendorJs, {
  inputFiles: [ '**/*' ],
  outputFile: 'vendor.js',
  headerFiles: ['jquery/dist/jquery.min.js'] // include jquery before bootstrap
});

/* CSS */
let css;
{
  let project = Project;
  let vendor = new Funnel(Vendor, {
    include: [
      '**/*/bootstrap.min.css',
      '**/*/bootstrap-tour-standalone.min.css'
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
