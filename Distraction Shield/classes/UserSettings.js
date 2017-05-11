import * as constants from '../constants'

    /* --------------- --------------- Serialization --------------- --------------- */

    //Private to this and storage.js
    serializeSettings (settingsObject) = function () {
        let obj = {
            status: settingsObject.getStatusObj(),
            sessionID: settingsObject.getSessionID(),
            mode: settingsObject.getMode(),
            interceptionInterval: settingsObject.getInterceptionInterval()
        };
        return JSON.stringify(obj);
    };

    //Private method
    parseSettingsObject (parsedSettingsObject)= function () {
        let s = new UserSettings();
        let newStatus = parsedSettingsObject.status;
        newStatus.setAt = new Date(newStatus.setAt);
        newStatus.offTill = new Date(newStatus.offTill);
        s.setStatusObj(newStatus);
        s.setMode(parsedSettingsObject.mode);
        s.setSessionID(parsedSettingsObject.sessionID);
        s.setInterceptionInterval(parsedSettingsObject.interceptionInterval);
        return s;
    };

    //Private to this and storage.js
    deserializeSettings (serializedSettingsObject) = function (){
        if (serializedSettingsObject !== null) {
            let parsed = JSON.parse(serializedSettingsObject);
            return parseSettingsObject(parsed);
        }
        return null;
    };

    /* --------------- --------------- --------------- --------------- --------------- */

    class UserSettings{
        constructor(){
            this._status = {
                state: true,
                setAt: new Date(),
                offTill: new Date()
            };

            this._sesionID = undefined;
            this._mode = constants.modes.lazy;
            this._interceptionInterval = 1;
        }

        set sessionID(newID) { this._sesionID = newID;};
        get sessionID() { return this._sesionID; };

        set interceptionInterval(val) {this._interceptionInterval = val;};
        get interceptionInterval() {return this._interceptionInterval; };

        set mode(newMode) { this._mode = newMode; };
        get mode() { return this._mode;};

        set status(newStatus) {this._status = newStatus;};
        get status() { return this._status;};

        get offTill(){return this._status.offTill;}

        set OffTill(time) {
            this._status.offTill = time;
        }

        getState() {
            return this._status.state ? "On" : "Off";
        };

        getNotState() {
            return this._status.state ? "Off" : "On";
        };

        turnOn() {
            if (this.getState() === "Off") {
                this._status = {state: true, setAt: new Date(), offTill: new Date()};
            } else {
                console.log("Already turned on, should not happen!");
            }
        };

        turnOff() {
            if (this.getState() === "On") {
                this._status = {state: false, setAt: new Date(), offTill: status.offTill};
                this.setTimer();
            } else {
                console.log("Already turned off, should not happen!");
            }
        };

        turnOffFor(minutes) {
            let curDate = new Date();
            let time = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
            this.setOffTill(time);
            this.turnOff();
        };

        turnOffForDay  () {
            let time = new Date(new Date().setHours(24, 0, 0, 0));
            this.setOffTill(time);
            this.turnOff();
        };

        turnOffFromBackground  () {
            if (this.getState() === "On") {
                let curDate = new Date();
                let newOffTill = new Date(curDate.setMinutes(interceptionInterval + curDate.getMinutes()));
                this._status = {state: false, setAt: new Date(), offTill: newOffTill};
                this.setTimer();
            }
        };

        turnExtensionBackOn  () {
            if (this.getState() === "Off") {
                this.turnOn();
            }
        };

        setTimer() {
            let timerInMS = this._status.offTill - new Date();
            setTimeout(this.turnExtensionBackOn, timerInMS);
        };

        copySettings  (settingsObject) {
            this._status = settingsObject.status;
            this._sesionID = settingsObject.sessionID;
            this._interceptionInterval = settingsObject.interceptionInterval;
            this.mode = settingsObject.mode;
        };

        reInitTimer  () {
            if (this.getState() === "Off") {
                if (UserSettings.getOffTill() < new Date()) {
                    this.turnOn();
                } else {
                    this.setTimer();
                }
            }
        };
    }
}
