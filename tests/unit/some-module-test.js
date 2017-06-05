import { module, test } from 'qunit';
import usm from 'distraction-shield/some-module';

module('some-module');

test('duder', function(assert) {
  assert.equal(usm(), 343);
});
