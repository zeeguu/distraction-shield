import test from 'ava';
import UserSettings from './UserSettings';

test.beforeEach(t => {
  t.context.userSettings = new UserSettings();
  t.context.userSettings.offTill = new Date();
  t.context.userSettings._status = {
    state: false,
    setAt: new Date(),
    offTill: new Date()
  }
});

test('UserSettings | should turn on the extension', t => {
  t.context.userSettings.turnOn();
  t.truthy(t.context.userSettings.isInterceptionOn());
});

test('UserSettings | turnOff the extension', t => {
  t.context.userSettings.turnOff();
  t.truthy(!t.context.userSettings.isInterceptionOn());
});

test('UserSettings | turnOffFor minutes the extension', t => {
  t.context.userSettings.turnOn();
  var minutes = 10;

  const curDate = new Date();
  let offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));

  t.context.userSettings.turnOffFor(minutes, true);

  t.is(t.context.userSettings.state, 'Off');
  t.is(t.context.userSettings.offTill.getMinutes(), offTill.getMinutes());
});

test('UserSettings | turnOffForDay the extension', t => {
  t.context.userSettings.turnOn();

  let offTill = new Date(new Date().setHours(24, 0, 0, 0));
  t.context.userSettings.turnOffForDay(true);

  t.is(t.context.userSettings.state, 'Off');
  t.is(t.context.userSettings.offTill.getDay(), offTill.getDay());
});
