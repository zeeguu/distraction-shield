import test from 'ava';
import UserSettings from '../../classes/UserSettings';
import BlockedSiteList from '../../classes/BlockedSiteList'
import BlockedSite from '../../classes/BlockedSite'
import * as constants from '../../constants'
import {
  getSettings,
  getBlacklist,
  getMode,
  getInterceptCounter
}from './storage'


test.beforeEach(t => {

  t.context.userSettings = new UserSettings();

  t.context.blockedList = new BlockedSiteList();
  t.context.blockedSite = new BlockedSite("https://www.facebook.com", "Facebook");
  t.context.blockedList.addToList(t.context.blockedSite);
  global.chrome = chrome;
});

test.cb('storage should get user settings', t => {
  t.plan(1);
  let dataKey = constants.tds_settings;
  let dataValue = UserSettings.serializeSettings(t.context.userSettings);
  let newObject = {};
  newObject[dataKey] = dataValue;
  global.chrome.storage.sync.get.flush();
  global.chrome.storage.sync.get.yields(newObject);
  getSettings((output) => {
    output = UserSettings.serializeSettings(output);
    t.truthy(dataValue, output);
    t.end();
  });
});

test.cb('storage should get blacklist', t => {
  t.plan(1);
  let dataKey = constants.tds_blacklist;
  let dataValue = BlockedSiteList.serializeBlockedSiteList(t.context.blockedList);
  let newObject = {};
  newObject[dataKey] = dataValue;
  global.chrome.storage.sync.get.flush();
  global.chrome.storage.sync.get.yields(newObject);
  getBlacklist((output) => {
    output = BlockedSiteList.serializeBlockedSiteList(output);
    t.truthy(dataValue, output);
    t.end();
  });
});

test.cb('storage should get mod', t => {
  t.plan(1);
  let dataKey = constants.tds_settings;
  let dataValue = UserSettings.serializeSettings(t.context.userSettings);
  let newObject = {};
  newObject[dataKey] = dataValue;
  global.chrome.storage.sync.get.flush();
  global.chrome.storage.sync.get.yields(newObject);
  getMode((output) => {
    dataValue = UserSettings.deserializeSettings(dataValue);
    dataValue = dataValue.mode;
    t.truthy(dataValue, output);
    t.end();
  });
});

test.cb('storage should get intercept counter', t => {
  t.plan(1);
  let dataKey = constants.tds_interceptCounter;
  let dataValue = 10;
  let newObject = {};
  newObject[dataKey] = dataValue;
  global.chrome.storage.sync.get.flush();
  global.chrome.storage.sync.get.yields(newObject);
  getInterceptCounter().then((output) => {
    t.truthy(dataValue, output);
    t.end();
  });
});
