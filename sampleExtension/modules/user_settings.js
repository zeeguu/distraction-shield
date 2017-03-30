
function SettingsObject () {

    this.status = { state: true,
                    setAt: new Date(),
                    offTill: new Date()
                  };

    this.getState = function()  {
        return this.status.state ? "On" : "Off";
    };

    this.toggleState = function() {
        if (this.getState() == "On") {
            this.turnOff();
        } else {
            this.turnOn();
        }
    };

    this.turnOn = function()  {
        if (this.getState() == "Off") {
            this.status = { state: true, setAt: new Date() };
        } else {
            console.log("Already turned on, should not happen!");
        }
    };

    this.turnOff = function()  {
        if (this.getState() == "On") {
            this.status = {state: false, setAt: new Date()};
            setTimer(this);
            removeWebRequestListener();
        } else {
            console.log("Already turned off, should not happen!");
        }
    };

    this.turnOffFor = function(minutes) {
        var curDate = new Date();
        this.status.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
        console.log("turned off until: " + this.status.offTill);
        this.turnOff();
    };

    this.turnOffForDay = function()  {
        this.status.offTill= new Date((new Date()).setHours(24,0,0,0));
        this.turnOff();
    };

    this.turnOffTill = function(dateObject) {
        this.status.offTill = dateObject;
        this.turnOff();
    }

}


/* --------------- --------------- --------------- --------------- --------------- */

//Private to this and sync_storage.js
settings_serialize = function(settingsObject) {
    return JSON.stringify(settingsObject);
};

//Private method
newSettingsObject = function(parsedSettingsObject) {
    var s = new SettingsObject();
    s.status.state = parsedSettingsObject.status.state;
    s.status.setAt = new Date(parsedSettingsObject.status.setAt);
    s.status.offTill = new Date(parsedSettingsObject.status.offTill);
    return s;
};

//Private to this and sync_storage.js
settings_deserialize = function(serializedSettingsObject) {
    var parsed = JSON.parse(serializedSettingsObject);
    return newSettingsObject(parsed);
};


/* --------------- --------------- --------------- --------------- --------------- */

//Private method
checkTimer = function(settingsObject) {
    return function () {
        var curTime = new Date();
        if (settingsObject.status.offTill <= curTime) {
            settingsObject.turnOn();
            addWebRequestListener();
            //TODO fix this timerVarError
            clearInterval(timerVar);
        }
    };
};

//Private method
setTimer = function(settingsObject) {
    setInterval(checkTimer(settingsObject), 60000);
};