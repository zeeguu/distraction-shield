
//TODO write a serializer module
define (['BlockedSite', 'BlockedSiteList', 'UserSettings'],
    function(BlockedSite, BlockedSiteList, UserSettings) {

    /* ---------------- TDS_Storage --------------- */
    getAll = function(callback) {
        getStorage(null).then(function(output) {
            console.log('output: ' + JSON.stringify(output)); //todo remove
            output.tds_settings = UserSettings.deserializeSettings(output.tds_settings);
            output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
            return callback(output);    
        });
    };

    getAllUnParsed = function(callback) {
        getStorage(null).then(function(output) {
            //output.tds_settings = UserSettings.deserializeSettings(output.tds_settings);
            //output.tds_blacklist = UserSettings.deserializeSettings(output.tds_blacklist);
            return callback(output);
        });
    };


    /* ---------------- Blacklist --------------- */

    getBlacklist = function(callback) {
        getStorage("tds_blacklist").then(function(output) {
            output.tds_blacklist = BlockedSiteList.deserializeBlockedSiteList(output.tds_blacklist);
            return callback(output.tds_blacklist);
        });
    };

    setBlacklist = function(blockedSiteList) {
        var serializedList = BlockedSiteList.serializeBlockedSiteList(blockedSiteList);
        setStorage("tds_blacklist", serializedList);
    };

    /* ---------------- Settings Object --------------- */

    getSettings = function(callback) {
        getStorage("tds_settings").then(function(output) {
            var deserializedSettings = UserSettings.deserializeSettings(output.tds_settings);
            return callback(deserializedSettings);
        });
    };

    setSettings = function(settingsObject) {
        setStorage("tds_settings", UserSettings.serializeSettings(settingsObject));
    };

    setSettingsWithCallback = function(settingsObject, callback) {
        var serializedSettings = UserSettings.serializeSettings(settingsObject);
        setStorage("tds_settings", serializedSettings).then(function(){
            return callback()
        });
    };

    getMode = function(callback) {
        getSettings(function(settings) {
            callback(settings.getMode());
        });
    };

    /* ---------------- Statistics --------------- */

    getInterceptCounter = function() {
        return getStorage("tds_interceptCounter");
    };

    setInterceptCounter = function(number) {
        return setStorage("tds_interceptCounter", number);
    };

    getInterceptDateList = function(){
        return getStorage("tds_interceptDateList");
    };

    setInterceptDateList = function(dateList) {
        return setStorage("tds_interceptDateList", dateList);
    };

    getExerciseTimeList = function(){
        return getStorage(["tds_exerciseTime"]);
    };

    setExerciseTimeList = function(statList){
        return setStorage("tds_exerciseTime", statList);
    };


    /* ---------------- General methods --------------- */

    // General function which is used to set items stored in the storage of the chrome api.
    // Returns a promise.
    setStorage = function(dataKey, dataValue) {
        return new Promise(function(resolve, reject){
            var newObject= {};
            newObject[dataKey] = dataValue;
            chrome.storage.sync.set(newObject, function() {
                if(handleRuntimeError()){
                    resolve();
                } else {
                    reject(Error("Data cannot be set."));
                }
            })
        });
    };

    // General function which is used to retrieve items stored in the storage of the chrome api.
    // This function returns a Promise, to account for possible delays which might exist between the requesting of
    // the things in the storage and the actual retrieving of it.
    getStorage = function(dataKey){
        return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(dataKey, function (output) {
                if (handleRuntimeError()) {
                    if(dataKey == null || dataKey.length > 1){
                        resolve(output);
                    } else {
                        resolve(output[dataKey]);
                    }
                } else {
                    reject(Error("Data cannot be found."));
                }
            })
        });
    };

    /* ---------------- not exported--------------- */
    //Check for a runtime error
    handleRuntimeError = function() {
        if (chrome.runtime.error) {
            console.log("Runtime error.\n" + chrome.runtime.error);
            return false;
        }
        return true;
    };

    return {
        getAll                  : getAll,
        getAllUnParsed          : getAllUnParsed,
        getBlacklist            : getBlacklist,
        setBlacklist            : setBlacklist,
        getSettings             : getSettings,
        setSettings             : setSettings,
        setSettingsWithCallback : setSettingsWithCallback,
        getMode                 : getMode,
        getInterceptCounter     : getInterceptCounter,
        setInterceptCounter     : setInterceptCounter,
        getInterceptDateList    : getInterceptDateList,
        setInterceptDateList    : setInterceptDateList,
        getExerciseTimeList     : getExerciseTimeList,
        setExerciseTimeList     : setExerciseTimeList,
        setStorage              : setStorage,
        getStorage              : getStorage
    }
});



// var storage = new SyncStorage();