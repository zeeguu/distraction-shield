
import BlockedSiteList from '../classes/BlockedSiteList'
import UserSettings    from '../classes/UserSettings'

/* ---------------- General methods --------------- */

// General function which is used to set items stored in the storage of the chrome api.
// Returns a promise.
export function setStorage(dataKey, dataValue) {
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

// General function which is used to retrieve items stored in the storage of the chrome api.
// This function returns a Promise, to account for possible delays which might exist between the requesting of
// the things in the storage and the actual retrieving of it.
export function getStorage(dataKey) {
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
    getStorage(null).then(function (output) {
        output.tds_settings = UserSettings.deserializeSettings(output.tds_settings);
        output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output);
    });
}
export function getAllUnParsed(callback) {
    getStorage(null).then(function (output) {
        return callback(output);
    });
}
/* ---------------- Blacklist --------------- */

export function getBlacklist(callback) {
    getStorage("tds_blacklist").then(function (output) {
        output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output.tds_blacklist);
    });
}

export function getBlacklistPromise() {
    return getStorage("tds_blacklist").then((output) =>
        BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist)
    );
}

export function setBlacklist(blockedSiteList) {
    let serializedList = BlockedSiteList.serializeBlockedSiteList(blockedSiteList);
    setStorage("tds_blacklist", serializedList);
}

/* ---------------- Settings Object --------------- */

export function getSettings(callback) {
    getStorage("tds_settings").then(function (output) {
        let deserializedSettings = UserSettings.deserializeSettings(output.tds_settings);
        return callback(deserializedSettings);
    });
}

export function getSettingsUnParsed(callback) {
    getStorage("tds_settings").then(function (output) {
        return callback(output.tds_settings);
    });
}
export function setSettings(settingsObject) {
    setStorage("tds_settings", UserSettings.serializeSettings(settingsObject));
}
export function setSettingsWithCallback(settingsObject, callback) {
    let serializedSettings = UserSettings.serializeSettings(settingsObject);
    setStorage("tds_settings", serializedSettings).then(function () {
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
    return getStorage("tds_interceptCounter");
}
export function setInterceptCounter(number) {
    return setStorage("tds_interceptCounter", number);
}
export function getInterceptDateList() {
    return getStorage("tds_interceptDateList");
}
export function setInterceptDateList(dateList) {
    return setStorage("tds_interceptDateList", dateList);
}

export function getExerciseTimeList() {
    return getStorage(["tds_exerciseTime"]);
}

export function setExerciseTimeList(statList) {
    return setStorage("tds_exerciseTime", statList);
}

/* ---------------- not exported--------------- */
//Check for a runtime error
function handleRuntimeError () {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
}
