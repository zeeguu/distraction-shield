import test from 'ava';
import Rectangle from './rectangle';

test('surface area', t => {
	let r = new Rectangle(8, 10);
  t.is(r.surface, 80);
});
