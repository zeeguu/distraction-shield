/* eslint-env node */
let EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    vendorFiles: {
      'jquery.js': null,
      'ember.js': null,
      'app-shims.js': null,
      'ember-cli': null
    }
  });

  return app.toTree();
};
