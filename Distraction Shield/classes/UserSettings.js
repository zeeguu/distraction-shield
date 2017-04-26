define (['constants'], function UserSettings(constants) {

    /* --------------- --------------- Serialization --------------- --------------- */

    //Private to this and storage.js
    serializeSettings = function(settingsObject) {
        return JSON.stringify(settingsObject);
    };

    //Private method
    parseSettingsObject = function(parsedSettingsObject) {
        var s = new UserSettings();
        var newStatus = parsedSettingsObject.getStatus();
        s.getStatus().state = newStatus.state;
        s.getStatus().setAt = new Date(newStatus.setAt);
        s.getStatus().offTill = new Date(newStatus.offTill);
        s.setMode(parsedSettingsObject.getMode());
        s.setSessionID(parsedSettingsObject.getSessionID());
        s.setInterceptionInterval(parsedSettingsObject.getInterceptionInterval());
        return s;
    };

    //Private to this and storage.js
    deserializeSettings = function(serializedSettingsObject) {
        if (serializedSettingsObject != null) {
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
                this.forwardToBackground();
            } else {
                console.log("Already turned on, should not happen!");
            }
        };

        this.turnOff = function () {
            if (this.getState() == "On") {
                status = {state: false, setAt: new Date(), offTill: status.offTill};
                this.setTimer();
                this.forwardToBackground();
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

        //Private method
        forwardToBackground = function () {
            synchronizer.syncSettings(self);
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
            status = settingsObject.status;
            sesionID = settingsObject.sessionID;
            interceptionInterval = settingsObject.interceptionInterval;
            mode = settingsObject.mode;
        };

        this.reInitTimer = function () {
            if (this.getState() == "Off") {
                if (this.getOffTill() < new Date()) {
                    self.turnOn();
                } else {
                    this.setTimer();
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
