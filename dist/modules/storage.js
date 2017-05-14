'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setStorage = setStorage;
exports.getStorage = getStorage;
exports.getAll = getAll;
exports.getAllUnParsed = getAllUnParsed;
exports.getBlacklist = getBlacklist;
exports.setBlacklist = setBlacklist;
exports.getSettings = getSettings;
exports.getSettingsUnParsed = getSettingsUnParsed;
exports.setSettings = setSettings;
exports.setSettingsWithCallback = setSettingsWithCallback;
exports.getMode = getMode;
exports.getInterceptCounter = getInterceptCounter;
exports.setInterceptCounter = setInterceptCounter;
exports.getInterceptDateList = getInterceptDateList;
exports.setInterceptDateList = setInterceptDateList;
exports.getExerciseTimeList = getExerciseTimeList;
exports.setExerciseTimeList = setExerciseTimeList;

var _BlockedSiteList = require('../classes/BlockedSiteList');

var _BlockedSiteList2 = _interopRequireDefault(_BlockedSiteList);

var _UserSettings = require('../classes/UserSettings');

var _UserSettings2 = _interopRequireDefault(_UserSettings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ---------------- General methods --------------- */

// General function which is used to set items stored in the storage of the chrome api.
// Returns a promise.
function setStorage(dataKey, dataValue) {
    return new Promise(function (resolve, reject) {
        var newObject = {};
        newObject[dataKey] = dataValue;
        chrome.storage.sync.set(newObject, function () {
            if (handleRuntimeError()) {
                resolve();
            } else {
                reject(Error("Data cannot be set."));
            }
        });
    });
}

// General function which is used to retrieve items stored in the storage of the chrome api.
// This function returns a Promise, to account for possible delays which might exist between the requesting of
// the things in the storage and the actual retrieving of it.
function getStorage(dataKey) {
    return new Promise(function (resolve, reject) {
        chrome.storage.sync.get(dataKey, function (output) {
            if (handleRuntimeError()) {
                if (dataKey === null || dataKey.length > 1) {
                    resolve(output);
                } else {
                    resolve(output[dataKey]);
                }
            } else {
                reject(Error("Data cannot be found."));
            }
        });
    });
}

/* ---------------- TDS_Storage --------------- */
function getAll(callback) {
    getStorage(null).then(function (output) {
        output.tds_settings = _UserSettings2.default.deserializeSettings(output.tds_settings);
        output.tds_blacklist = _BlockedSiteList2.default.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output);
    });
}
function getAllUnParsed(callback) {
    getStorage(null).then(function (output) {
        return callback(output);
    });
}
/* ---------------- Blacklist --------------- */

function getBlacklist(callback) {
    getStorage("tds_blacklist").then(function (output) {
        output.tds_blacklist = _BlockedSiteList2.default.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output.tds_blacklist);
    });
}
function setBlacklist(blockedSiteList) {
    var serializedList = _BlockedSiteList2.default.serializeBlockedSiteList(blockedSiteList);
    setStorage("tds_blacklist", serializedList);
}

/* ---------------- Settings Object --------------- */

function getSettings(callback) {
    getStorage("tds_settings").then(function (output) {
        var deserializedSettings = _UserSettings2.default.deserializeSettings(output.tds_settings);
        return callback(deserializedSettings);
    });
}

function getSettingsUnParsed(callback) {
    getStorage("tds_settings").then(function (output) {
        return callback(output.tds_settings);
    });
}
function setSettings(settingsObject) {
    setStorage("tds_settings", _UserSettings2.default.serializeSettings(settingsObject));
}
function setSettingsWithCallback(settingsObject, callback) {
    var serializedSettings = _UserSettings2.default.serializeSettings(settingsObject);
    setStorage("tds_settings", serializedSettings).then(function () {
        return callback();
    });
}
function getMode(callback) {
    getSettings(function (settings) {
        callback(settings.mode);
    });
}
/* ---------------- Statistics --------------- */

function getInterceptCounter() {
    return getStorage("tds_interceptCounter");
}
function setInterceptCounter(number) {
    return setStorage("tds_interceptCounter", number);
}
function getInterceptDateList() {
    return getStorage("tds_interceptDateList");
}
function setInterceptDateList(dateList) {
    return setStorage("tds_interceptDateList", dateList);
}

function getExerciseTimeList() {
    return getStorage(["tds_exerciseTime"]);
}

function setExerciseTimeList(statList) {
    return setStorage("tds_exerciseTime", statList);
}

/* ---------------- not exported--------------- */
//Check for a runtime error
function handleRuntimeError() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
};