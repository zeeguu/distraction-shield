import QUnit from 'qunit';
import TestLoader from 'ember-cli-test-loader/test-support';

// optionally override TestLoader.prototype.shouldLoadModule
TestLoader.load();

QUnit.start();
