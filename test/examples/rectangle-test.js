import test from 'ava';
import Rectangle from './../../Distraction\ Shield/examples/Rectangle';

test('surface area', t => {
	let r = new Rectangle(8, 10);
  t.assert(r.surface, 80);
});
