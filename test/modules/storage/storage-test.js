import test from 'ava';
import UserSettings from './UserSettings';
import BlockedSiteList from './BlockedSiteList'
import BlockedSite from './BlockedSite'
import * as constants from './constants'
import {
  getSettings,
  getBlacklist,
  getMode,
  getInterceptCounter
}from './storage'


test.before( (t)=> {
  t.context.userSettings = new UserSettings();

  t.context.blockedList = new BlockedSiteList();
  t.context.blockedSite = new BlockedSite("https://www.facebook.com", "Facebook");
  t.context.blockedList.addToList(t.context.blockedSite);
});

test('storage should get user settings', t=>{
  let dataKey = constants.tds_settings;
  let dataValue = UserSettings.serializeSettings(t.context.userSettings);
  let newObject = {};
  newObject[dataKey] = dataValue;
  chrome.storage.sync.get.flush();
  chrome.storage.sync.get.yields(newObject);
  getSettings(function (output) {
    output = UserSettings.serializeSettings(output);
    test.truthy(dataValue, output);
  });
});

test('storage should get blacklist', t => {
  let dataKey = constants.tds_blacklist;
  let dataValue = BlockedSiteList.serializeBlockedSiteList(t.context.blockedList);
  let newObject = {};
  newObject[dataKey] = dataValue;
  chrome.storage.sync.get.flush();
  chrome.storage.sync.get.yields(newObject);
  getBlacklist(function (output) {
    output = BlockedSiteList.serializeBlockedSiteList(output);
    test.truthy(dataValue, output);
  });
});

test('storage should get mod',t=> {
  let dataKey = constants.tds_settings;
  let dataValue = UserSettings.serializeSettings(t.context.userSettings);
  let newObject = {};
  newObject[dataKey] = dataValue;
  chrome.storage.sync.get.flush();
  chrome.storage.sync.get.yields(newObject);
  getMode(function (output) {
    dataValue = UserSettings.deserializeSettings(dataValue);
    dataValue = dataValue.mode;
    test.truthy(dataValue, output);
  });
});

test('storage should get intercept counter', ()=> {
  let dataKey = constants.tds_interceptCounter;
  let dataValue = 10;
  let newObject = {};
  newObject[dataKey] = dataValue;
  chrome.storage.sync.get.flush();
  chrome.storage.sync.get.yields(newObject);
  getInterceptCounter(function (output) {
    test.truthy(dataValue, output);
  });
});



