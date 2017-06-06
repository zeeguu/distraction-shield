/* eslint-env node */
// import plugins
const babel = require('broccoli-babel-transpiler');
const Funnel = require('broccoli-funnel');
const Merge = require('broccoli-merge-trees');
const Concat = require('broccoli-concat');
const path = require('path');

/* Funnel all */
const Project = new Funnel('Distraction\ Shield');
const Vendor = new Funnel('bower_components');

/* HTML */
let html;
{
  let project = new Funnel(Project, {
    include: [ '**/*.html' ],
    exclude: [ '**/*copy.html' ],
    getDestinationPath: (file) => path.basename(file)
  });
  html = project;
}

/* JS */
let js;
{
  // babel transpilation: grab the source and transpile in 1 step
  let project = babel(Project, {
    presets: [ 'env' ],
    sourceMaps: 'inline'
  });

  let vendor = new Funnel(Vendor, {
    include: [
      '**/*/jquery.min.js',
      '**/*/bootstrap.min.js',
      '**/*/bootstrap-tour-standalone.min.js'
    ]
  });

  js = Merge([ project, vendor ]);
  js = new Concat(js, {
    inputFiles: ['**/*.js'],
    outputFile: 'distraction-shield.js'
  });
}

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



module.exports = new Merge([ html, js, css, assets ]);
