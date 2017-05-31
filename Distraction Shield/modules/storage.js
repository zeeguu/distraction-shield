import BlockedSiteList from '../classes/BlockedSiteList'
import UserSettings    from '../classes/UserSettings'

/* ---------------- General methods --------------- */

/**
 * General function which is used to set items stored in the storage of the chrome api.
 * @param dataKey The key of the changed element in the storage
 * @param dataValue The new value of the element
 * @returns {Promise}
 */
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


/**
 * General function which is used to retrieve items stored in the storage of the chrome api.
 * This function returns a Promise, to account for possible delays which might exist between the requesting of
 * the things in the storage and the actual retrieving of it.
 * @param dataKey The key of the element that has to be taken from the storage
 * @returns {Promise}
 */
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
/**
 * Gets all elements from the storage
 * @param callback
 */
export function getAll(callback) {
    getStorage(null).then(function (output) {
        output.tds_settings = UserSettings.deserializeSettings(output.tds_settings);
        output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output);
    });
}

/**
 * Get all unparsed elements
 * @param callback
 */
export function getAllUnParsed(callback) {
    getStorage(null).then(function (output) {
        return callback(output);
    });
}
/* ---------------- Blacklist --------------- */

/**
 * Get the sites that are in the blacklist
 * @param callback Function that has as a parameter the blacklist
 */
export function getBlacklist(callback) {
    getStorage("tds_blacklist").then(function (output) {
        output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
        return callback(output.tds_blacklist);
    });
}

/**
 * Get the sites that are in the blacklist deserialised
 * @returns {Promise.<TResult>}
 */
export function getBlacklistPromise() {
    return getStorage("tds_blacklist").then((output) =>
        BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist)
    );
}

/**
 * Set the blacklist of sites in the storage
 * @param blockedSiteList The list of blocked sites
 */
export function setBlacklist(blockedSiteList) {
    let serializedList = BlockedSiteList.serializeBlockedSiteList(blockedSiteList);
    setStorage("tds_blacklist", serializedList);
}

/* ---------------- Settings Object --------------- */
/**
 * Get the user settings
 * @param callback A function that has the deserialized user settings as a parameter
 */
export function getSettings(callback) {
    getStorage("tds_settings").then(function (output) {
        let deserializedSettings = UserSettings.deserializeSettings(output.tds_settings);
        return callback(deserializedSettings);
    });
}

/**
 * Get the user settings
 * @param callback A function that has the deserialized user settings as a parameter
 */
export function getSettingsUnParsed(callback) {
    getStorage("tds_settings").then(function (output) {
        return callback(output.tds_settings);
    });
}

/**
 * Set the user settings in the storage
 * @param settingsObject The user settings object
 */
export function setSettings(settingsObject) {
    setStorage("tds_settings", UserSettings.serializeSettings(settingsObject));
}

/**
 * Set the user settings in the storage and return the callback function
 * @param settingsObject The user settings object
 * @param callback The function to be returned
 */
export function setSettingsWithCallback(settingsObject, callback) {
    let serializedSettings = UserSettings.serializeSettings(settingsObject);
    setStorage("tds_settings", serializedSettings).then(function () {
        return callback()
    });
}
/**
 * Get the mode of the extension (ex: Lazy, Pro)
 * @param callback A function that is called with the mode as a parameter
 */
export function getMode(callback) {
    getSettings(function (settings) {
        callback(settings.mode);
    });
}
/* ---------------- Statistics --------------- */
/**
 * Get the number of intercepts
 * @returns {Promise}
 */
export function getInterceptCounter() {
    return getStorage("tds_interceptCounter");
}
/**
 * Set the interception counter
 * @param number The number to be set
 * @returns {Promise}
 */
export function setInterceptCounter(number) {
    return setStorage("tds_interceptCounter", number);
}
/**
 * Get the list with the interception dates
 * @returns {Promise}
 */
export function getInterceptDateList() {
    return getStorage("tds_interceptDateList");
}

/**
 * Set the list with the interception dates
 * @param dateList List with interception dates
 * @returns {Promise}
 */
export function setInterceptDateList(dateList) {
    return setStorage("tds_interceptDateList", dateList);
}

/**
 * Get the the list with the exercise time
 * @returns {Promise}
 */
export function getExerciseTimeList() {
    return getStorage(["tds_exerciseTime"]);
}

/**
 * Set the the list with the exercise time
 * @param statList
 * @returns {Promise}
 */
export function setExerciseTimeList(statList) {
    return setStorage("tds_exerciseTime", statList);
}

/* ---------------- not exported--------------- */
/**
 * Checker for runtime errors. It loges the error in the console.
 * @returns {boolean} True if there is no error, Fales otherwise
 */
function handleRuntimeError() {
    if (chrome.runtime.error) {
        console.log("Runtime error.\n" + chrome.runtime.error);
        return false;
    }
    return true;
}
