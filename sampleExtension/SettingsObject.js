
function SettingsObject () {

    this.status = { state: true,
                    setAt: new Date()
                  };
    this.offTill = new Date();
}


settings_getState = function(settingsObject)  {
    return settingsObject.status.state ? "On" : "Off";
};

settings_turnOn = function(settingsObject)  {
    if (settings_getState(settingsObject) == "Off") {
        settingsObject.status = { state: true, setAt: new Date() };
    } else {
        console.log("Already turned on, should not happen!");
    }
};

settings_turnOff = function(settingsObject)  {
    if (settings_getState(settingsObject) == "On") {
        settingsObject.status = {state: false, setAt: new Date()};
        setTimer(settingsObject);
        removeWebRequestListener();
    } else {
        console.log("Already turned off, should not happen!");
    }
};

settings_turnOffFor = function(settingsObject, minutes) {
    curDate = new Date();
    settingsObject.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
    console.log("turned off until: " + settingsObject.offTill);
    settings_turnOff(settingsObject);
};

settings_turnOffForDay = function(settingsObject)  {
    settingsObject.offTill = new Date((new Date()).setHours(24,0,0,0));
    settings_turnOff(settingsObject);
};

/* --------------- --------------- --------------- --------------- --------------- */

//Private to this and syncStorage.js
settings_serialize = function(settingsObject) {
    var s = { state: settingsObject.status.state,
              setAt: settingsObject.status.setAt.getTime()
            };
    return {status: s, offTill: settingsObject.offTill.getTime()};
};

//Private method
newSettingsObject = function(state, setAt, offTill) {
    var s = new SettingsObject();
    s.status.state = state;
    s.status.setAt = setAt;
    s.offTill = offTill;
    return s;
};

//Private to this and syncStorage.js
settings_deserialize = function(serializedSettingsObject) {
    var status = serializedSettingsObject.status;
    var state = status.state;
    var setAt = new Date(status.setAt);
    var offTill = new Date(serializedSettingsObject.offTill);
    return newSettingsObject(state, setAt, offTill);
};


/* --------------- --------------- --------------- --------------- --------------- */

//Private method
checkTimer = function(settingsObject) {
    return function () {
        curTime = new Date();
        if (settingsObject.offTill <= curTime) {
            settings_turnOn(settingsObject);
            addWebRequestListener();
            clearInterval(timerVar);
        }
    };
};

//Private method
setTimer = function(settingsObject) {
    timerVar = setInterval(checkTimer(settingsObject), 60000);
};