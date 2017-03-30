
function SettingsObject () {
    var self = this;

    this.status = { state: true,
                    setAt: new Date(),
                    offTill: new Date()
                  };
    this.sessionID = 0;
    this.mode = modes.lazy;
    this.interceptionInterval = 1;

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
            this.status = { state: true, setAt: new Date(), offTill: this.status.offTill };
            this.startBackground();
            console.log("turned on at: " + new Date());
        } else {
            console.log("Already turned on, should not happen!");
        }
    };

    this.turnOff = function()  {
        if (this.getState() == "On") {
            this.status = {state: false, setAt: new Date(), offTill: this.status.offTill};
            this.setTimer();
            this.stopBackground();
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
        this.status.offTill = new Date((new Date()).setHours(24,0,0,0));
        this.turnOff();
    };

    this.turnOffTill = function(dateObject) {
        this.status.offTill = dateObject;
        this.turnOff();
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

    this.startBackground = function() {
        var bg = chrome.extension.getBackgroundPage();
        bg.setLocalSettings(this);
        setStorageSettings(this);
        bg.replaceListener();
    };

    this.stopBackground = function() {
        var bg = chrome.extension.getBackgroundPage();
        bg.setLocalSettings(this);
        setStorageSettings(this);
        bg.removeWebRequestListener();
    };

}


/* --------------- --------------- --------------- --------------- --------------- */

//Private to this and sync_storage.js
settings_serialize = function(settingsObject) {
    return JSON.stringify(settingsObject);
};

//Private method
parseSettingsObject = function(parsedSettingsObject) {
    var s = new SettingsObject();
    s.status.state = parsedSettingsObject.status.state;
    s.status.setAt = new Date(parsedSettingsObject.status.setAt);
    s.status.offTill = new Date(parsedSettingsObject.status.offTill);
    s.mode = parsedSettingsObject.mode;
    s.sessionID = parsedSettingsObject.sessionID;
    s.interceptionInterval = parsedSettingsObject.interceptionInterval;
    return s;
};

//Private to this and sync_storage.js
settings_deserialize = function(serializedSettingsObject) {
    var parsed = JSON.parse(serializedSettingsObject);
    return parseSettingsObject(parsed);
};

/* --------------- --------------- --------------- --------------- --------------- */
