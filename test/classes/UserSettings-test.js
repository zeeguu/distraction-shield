import test from 'ava';
import UserSettings from './UserSettings';

test.beforeEach(t => {
  t.context.userSettingsOn = new UserSettings();
  t.context.userSettingsOn.offTill = new Date();
  t.context.userSettingsOn._status = {
    state: true,
    setAt: new Date(),
    offTill: new Date()
  };

  t.context.userSettingsOff = new UserSettings();
  t.context.userSettingsOff.offTill = new Date();
  t.context.userSettingsOff._status = {
    state: false,
    setAt: new Date(),
    offTill: new Date()
  };

});

test('UserSettings should turn on the extension', t => {
  t.context.userSettingsOff.turnOn();
  t.truthy(t.context.userSettingsOff.isInterceptionOn());
});

test('UserSettings turnOff the extension', t => {
  t.context.userSettingsOn.turnOff();
  t.falsy(t.context.userSettingsOn.isInterceptionOn());
});

test('UserSettings turnOffFor minutes the extension', t => {
  t.context.userSettingsOff.turnOn();
  var minutes = 10;

  const curDate = new Date();
  let offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));

  t.context.userSettingsOff.turnOffFor(minutes, true);

  t.falsy(t.context.userSettingsOff.isInterceptionOn());
  t.is(t.context.userSettingsOff.offTill.getMinutes(), offTill.getMinutes());
});

test('UserSettings turnOffForDay the extension', t => {
  t.context.userSettingsOff.turnOn();

  let offTill = new Date(new Date().setHours(24, 0, 0, 0));
  t.context.userSettingsOff.turnOffForDay(true);

  t.falsy(t.context.userSettingsOff.isInterceptionOn());
  t.is(t.context.userSettingsOff.offTill.getDay(), offTill.getDay());
});
