// import plugins
var babel = require('broccoli-babel-transpiler');

// babel transpilation: grab the source and transpile in 1 step
var project = babel('Distraction Shield');

module.exports = project;
