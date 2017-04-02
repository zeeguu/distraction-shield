
function UserSettings () {
    var self = this;

    this.status = { state: true,
                    setAt: new Date(),
                    offTill: new Date()
                  };
    this.sessionID = 0;
    this.mode = modes.lazy;
    this.interceptionInterval = 1;

    this.setSessionID = function(newID) {this.sessionID = newID;};
    this.getSessionID = function() {return this.sessionID;};
    this.setInterceptionInterval = function(val) {this.interceptionInterval = val;};
    this.getInterceptionInterval = function() {return this.interceptionInterval;};
    this.setMode = function(newMode) {this.mode = newMode;};
    this.getMode = function() {return this.mode;};
    this.getOffTill = function() {return this.status.offTill;};

    this.getState = function() {return this.status.state ? "On" : "Off";};
    this.getNotState = function() {return this.status.state ? "Off" : "On";};

    this.turnOn = function()  {
        if (this.getState() == "Off") {
            this.status = { state: true, setAt: new Date(), offTill: new Date()};
            this.forwardToBackground();
        } else {
            console.log("Already turned on, should not happen!");
        }
    };

    this.turnOff = function()  {
        if (this.getState() == "On") {
            this.status = {state: false, setAt: new Date(), offTill: this.status.offTill};
            this.setTimer();
            this.forwardToBackground();
        } else {
            console.log("Already turned off, should not happen!");
        }
    };

    this.turnOffFor = function(minutes) {
        var curDate = new Date();
        this.status.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
        this.turnOff();
    };

    this.turnOffForDay = function()  {
        this.status.offTill = new Date((new Date()).setHours(24,0,0,0));
        this.turnOff();
    };

    this.turnOffFromBackground = function() {
        if(self.getState() == "On") {
            var curDate = new Date();
            var newOffTill = new Date(curDate.setMinutes(self.interceptionInterval + curDate.getMinutes()));
            self.status = {state: false, setAt: new Date(), offTill: newOffTill};
            self.setTimer();
            storage.setSettings(this);
            replaceListener();
        }
    };

    //Private method
    this.turnExtensionBackOn = function() {
        self.turnOn();
    };

    //Private method
    this.setTimer = function() {
        var timerInMS = this.status.offTill - new Date();
        var MSint = timerInMS.toFixed();
        setTimeout(self.turnExtensionBackOn, MSint);
    };

    //Private method
    this.forwardToBackground = function() {
        synchronizer.syncSettings(this);
        var bg = chrome.extension.getBackgroundPage();
        bg.replaceListener();
    };

    this.copySettings = function(settingsObject) {
        this.status = settingsObject.status;
        this.sessionID = settingsObject.sessionID;
        this.interceptionInterval = settingsObject.interceptionInterval;
        this.mode = settingsObject.mode;
    };

    this.reInitTimer = function() {
        if (this.getState() == "Off") {
            if (this.getOffTill() < new Date()) {
                localSettings.turnOn();
            } else {
                this.setTimer();
            }
        }
    };
}

/* --------------- --------------- Serialization --------------- --------------- */

//Private to this and storage.js
settings_serialize = function(settingsObject) {
    return JSON.stringify(settingsObject);
};

//Private method
parseSettingsObject = function(parsedSettingsObject) {
    var s = new UserSettings();
    s.status.state = parsedSettingsObject.status.state;
    s.status.setAt = new Date(parsedSettingsObject.status.setAt);
    s.status.offTill = new Date(parsedSettingsObject.status.offTill);
    s.mode = parsedSettingsObject.mode;
    s.sessionID = parsedSettingsObject.sessionID;
    s.interceptionInterval = parsedSettingsObject.interceptionInterval;
    return s;
};

//Private to this and storage.js
settings_deserialize = function(serializedSettingsObject) {
    if (serializedSettingsObject != null) {
        var parsed = JSON.parse(serializedSettingsObject);
        return parseSettingsObject(parsed);
    }
    return null;
};

/* --------------- --------------- --------------- --------------- --------------- */
