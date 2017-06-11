/* eslint-env node */
let ghpages = require('gh-pages');
let git = require('git-rev-sync');
let chalk = require('chalk');
let async = require('async');

console.log(chalk.green('Publishing docs...'));
async.series([
  (callback) => {
    ghpages.publish('docs', {
      message: `Deploy ${git.short()} from ${git.branch()}`,push:false
    }, (err) => {
      if (err) console.error(err);

      console.log(chalk.green('Docs successfully published!'));
      callback();
    });
  }
]);
