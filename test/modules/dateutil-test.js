import test from 'ava';
import {
  msToHHMMSS,
  formatDate,
  getToday
} from './dateutil';

test('dateutil | should transform seconds to HH:MM:SS ', t => {
  let seconds = 5;
  let date = new Date(seconds * 1000).toISOString().substr(11, 8);

  t.is(msToHHMMSS(seconds * 1000), date);
});

test('dateutil | should stringify date', t => {
  let date = new Date();
  let stringDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  t.is(formatDate(date), stringDate);
});

test('dateutil | should get today', t => {
  let date = new Date();
  let today = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  t.is(getToday(), today);
});
