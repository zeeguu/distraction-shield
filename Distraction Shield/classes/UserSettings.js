define (['constants'], function UserSettings(constants) {

    /* --------------- --------------- Serialization --------------- --------------- */

    //Private to this and storage.js
    serializeSettings = function(settingsObject) {
        var obj = {
            status: settingsObject.getStatusObj(),
            sessionID: settingsObject.getSessionID(),
            mode: settingsObject.getMode(),
            interceptionInterval: settingsObject.getInterceptionInterval()
        };
        return JSON.stringify(obj);
    };

    //Private method
    parseSettingsObject = function(parsedSettingsObject) {
        var s = new UserSettings();
        var newStatus = parsedSettingsObject.status;
        newStatus.setAt = new Date(newStatus.setAt);
        newStatus.offTill = new Date(newStatus.offTill);
        s.setStatusObj(newStatus);
        s.setMode(parsedSettingsObject.mode);
        s.setSessionID(parsedSettingsObject.sessionID);
        s.setInterceptionInterval(parsedSettingsObject.interceptionInterval);
        return s;
    };

    //Private to this and storage.js
    deserializeSettings = function(serializedSettingsObject) {
        if (serializedSettingsObject !== null) {
            var parsed = JSON.parse(serializedSettingsObject);
            return parseSettingsObject(parsed);
        }
        return null;
    };

    /* --------------- --------------- --------------- --------------- --------------- */

    function UserSettings() {
        var self = this;

        var status = {
            state: true,
            setAt: new Date(),
            offTill: new Date()
        };
        var sesionID = undefined;
        var mode = constants.modes.lazy;
        var interceptionInterval = 1;

        this.setSessionID = function (newID) {
            sesionID = newID;
        };
        this.getSessionID = function () {
            return sesionID;
        };
        this.setInterceptionInterval = function (val) {
            interceptionInterval = val;
        };
        this.getInterceptionInterval = function () {
            return interceptionInterval;
        };
        this.setMode = function (newMode) {
            mode = newMode;
        };

        this.getMode = function () {
            return mode;
        };

        this.getStatusObj = function () {
            return status;
        };
        this.setStatusObj = function (newStatus) {
            status = newStatus;
        };

        this.getOffTill = function () {
            return status.offTill;
        };

        this.getState = function () {
            return status.state ? "On" : "Off";
        };

        this.getNotState = function () {
            return status.state ? "Off" : "On";
        };

        this.turnOn = function () {
            if (this.getState() == "Off") {
                status = {state: true, setAt: new Date(), offTill: new Date()};
            } else {
                console.log("Already turned on, should not happen!");
            }
        };

        this.turnOff = function () {
            if (this.getState() == "On") {
                status = {state: false, setAt: new Date(), offTill: status.offTill};
                setTimer();
            } else {
                console.log("Already turned off, should not happen!");
            }
        };

        this.turnOffFor = function (minutes) {
            var curDate = new Date();
            status.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
            this.turnOff();
        };

        this.turnOffForDay = function () {
            status.offTill = new Date(new Date().setHours(24, 0, 0, 0));
            this.turnOff();
        };

        this.turnOffFromBackground = function () {
            if (self.getState() == "On") {
                var curDate = new Date();
                var newOffTill = new Date(curDate.setMinutes(self.interceptionInterval + curDate.getMinutes()));
                self.status = {state: false, setAt: new Date(), offTill: newOffTill};
                self.setTimer();
            }
        };

        this.turnExtensionBackOn = function () {
            if (self.getState() == "Off") {
                self.turnOn();
            }
        };

        //Private method
        setTimer = function () {
            var timerInMS = status.offTill - new Date();
            var MSint = timerInMS.toFixed();
            setTimeout(this.turnExtensionBackOn, MSint);
        };

        this.copySettings = function (settingsObject) {
            status = settingsObject.getStatusObj();
            sesionID = settingsObject.getSessionID();
            interceptionInterval = settingsObject.getInterceptionInterval();
            mode = settingsObject.getMode();
        };

        this.reInitTimer = function () {
            if (this.getState() == "Off") {
                if (this.getOffTill() < new Date()) {
                    self.turnOn();
                } else {
                    setTimer();
                }
            }
        };
    }
    
    return {
        UserSettings : UserSettings,
        serializeSettings : serializeSettings,
        deserializeSettings : deserializeSettings
    }

});
