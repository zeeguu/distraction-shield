/* eslint-env node */
let ghpages = require('gh-pages');
let git = require('git-rev-sync');
let chalk = require('chalk');

console.log(chalk.green('Publishing docs...'));

ghpages.publish('docs', {
  message: `Deploy ${git.short()} from ${git.branch()}`
}, (err) => {
  if (err) throw Error(err);

  console.log(chalk.green('Docs successfully published!'));
});
