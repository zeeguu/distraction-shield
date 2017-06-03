import BlockedSiteList from '../classes/BlockedSiteList'
import UserSettings    from '../classes/UserSettings'
import * as constants  from '../constants'


/* ---------------- General methods --------------- */

/**
 * used to set items stored in the storage of the chrome api. Returns a promise
 * @param {string} dataKey key of the data to store
 * @param {string} dataValue value of data to store
 */
function setStorage(dataKey, dataValue) {
    return new Promise(function (resolve, reject) {
        let newObject = {};
        newObject[dataKey] = dataValue;
        chrome.storage.sync.set(newObject, function () {
            if (handleRuntimeError()) {
                resolve();
            } else {
                reject(Error("Data cannot be set."));
            }
        })
    });
}

/**
 * used to retrieve items stored from the storage of the chrome api. Returns a promise due to asynchronousness
 * @param {string} dataKey key of the data to store
 */
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
        })
    });
}

/* ---------------- TDS_Storage --------------- */

export function getAll(callback) {
    getStorage(constants.tds_all).then(function (output) {
        output.tds_settings = UserSettings.deserializeSettings(output.tds_settings);
        output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output);
    });
}

export function getAllUnParsed(callback) {
    getStorage(constants.tds_all).then(function (output) {
        return callback(output);
    });
}
/* ---------------- Blacklist --------------- */

export function getBlacklist(callback) {
    getStorage(constants.tds_blacklist).then(function (output) {
        output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output.tds_blacklist);
    });
}

export function getBlacklistPromise() {
    return getStorage(constants.tds_blacklist).then((output) =>
        BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist)
    );
}

export function setBlacklist(blockedSiteList) {
    let serializedList = BlockedSiteList.serializeBlockedSiteList(blockedSiteList);
    setStorage(constants.tds_blacklist, serializedList);
}

/* ---------------- Settings Object --------------- */

export function getSettings(callback) {
    getStorage(constants.tds_settings).then(function (output) {
        let deserializedSettings = UserSettings.deserializeSettings(output.tds_settings);
        return callback(deserializedSettings);
    });
}

export function getSettingsUnParsed(callback) {
    getStorage(constants.tds_settings).then(function (output) {
        return callback(output.tds_settings);
    });
}
export function setSettings(settingsObject) {
    return setStorage(constants.tds_settings, UserSettings.serializeSettings(settingsObject));
}
export function setSettingsWithCallback(settingsObject, callback) {
    let serializedSettings = UserSettings.serializeSettings(settingsObject);
    setStorage(constants.tds_settings, serializedSettings).then(function () {
        return callback()
    });
}
export function getMode(callback) {
    getSettings(function (settings) {
        callback(settings.mode);
    });
}
/* ---------------- Statistics --------------- */

export function getInterceptCounter() {
    return getStorage(constants.tds_interceptCounter);
}
export function setInterceptCounter(number) {
    return setStorage(constants.tds_interceptCounter, number);
}
export function getInterceptDateList() {
    return getStorage(constants.tds_interceptDateList);
}
export function setInterceptDateList(dateList) {
    return setStorage(constants.tds_interceptDateList, dateList);
}

export function getExerciseTimeList() {
    return getStorage([constants.tds_exerciseTime]);
}

export function setExerciseTimeList(statList) {
    return setStorage(constants.tds_exerciseTime, statList);
}


/* ----------------  Storage Modifications --------------- */

export function addBlockedSiteToStorage(blocked_site){
    return getBlacklistPromise().then(blacklist => {
        if (blacklist.addToList(blocked_site)){
            return setBlacklist(blacklist);
        } else
            return Promise.reject('not unique');
    });
}

export function removeBlockedSiteFromStorage(blocked_site){
    return getBlacklistPromise().then(blacklist => {
        blacklist.removeFromList(blocked_site);
        return setBlacklist(blacklist);
    });
}

export function updateBlockedSiteInStorage(blocked_site){
    return getBlacklistPromise().then(blacklist => {
        blacklist.updateInList(blocked_site);
        return setBlacklist(blacklist);
    });
}


/* ---------------- not exported--------------- */
/**
 * Check for a runtime error.
 */
function handleRuntimeError() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
}
