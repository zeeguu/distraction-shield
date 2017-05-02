// import plugins
var babel = require('broccoli-babel-transpiler');
var Funnel = require('broccoli-funnel');
var BroccoliMergeTrees = require('broccoli-merge-trees');

// babel transpilation: grab the source and transpile in 1 step
var project = babel('Distraction\ Shield', {
  presets: [ 'env' ]
});

// copy dependencies into build
var dependencies = new Funnel('bower_components', {
  destDir: 'dependencies',
  include: [
    '**/*/bootstrap-tour-standalone.min.css',
    '**/*/bootstrap-tour-standalone.min.js',
    '**/*/bootstrap.min.css',
    '**/*/bootstrap.min.js',
    '**/*/jquery.min.js'
  ],

  //  make sure for backwards compatibility with current project
  getDestinationPath: function(relativePath) {
    if (relativePath.lastIndexOf('bootstrap-tour-standalone.min.css') != -1) {
      return 'bootstrapTour/bootstrap-tour-standalone.min.css';
    } else if (relativePath
        .lastIndexOf('bootstrap-tour-standalone.min.js') != -1) {
      return 'bootstrapTour/bootstrap-tour-standalone.min.js';
    } else if (relativePath.lastIndexOf('bootstrap.min.css') != -1) {
      return 'bootstrap/css/bootstrap.min.css';
    } else if (relativePath.lastIndexOf('bootstrap.min.js') != -1) {
      return 'bootstrap/js/bootstrap.min.js';
    } else if (relativePath.lastIndexOf('jquery.min.js') != -1) {
      return 'jquery/jquery-1.10.2.js'
    }

    return relativePath;
  }
});

module.exports = new BroccoliMergeTrees([ dependencies, project ]);
