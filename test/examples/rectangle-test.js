/* eslint-env node */
var assert = require('assert');
var Rectangle = require('../../dist/examples/rectangle.js')['default'];

describe('Rectangle | module example', function() {
  before(function() {
    this.rect = new Rectangle(5, 4);
  });

  it('should compute surface correctly', function() {
    assert.equal(this.rect.surface, 20);
  });
});
