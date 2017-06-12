/* eslint-env node */
let ghpages = require('gh-pages');
let git = require('git-rev-sync');
let chalk = require('chalk');
let async = require('async');

console.log(chalk.green('Publishing docs...'));
async.series([
  (callback) => {
    ghpages.publish('Website/_site', {
      message: `Deploy ${git.short()} from ${git.branch()}`
    }, (err) => {
      if (err) console.error(err);

      console.log(chalk.green('Docs successfully published!'));
      callback();
    });
  }
]);
