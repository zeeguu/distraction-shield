import * as constants from '../constants'
import * as storage from '../modules/storage'
import * as synchronizer from '../modules/synchronizer'

export default class UserSettings {
    constructor() {
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

    get offTill() {return this._status.offTill;}
    set offTill(time) { this._status.offTill = time;}

    get state() {return this.status.state ? "On" : "Off";};
    get notState() {return this._status.state ? "Off" : "On"; };

    turnOn() {
        if (this.state == "Off") {
            this.status = {state: true, setAt: new Date(), offTill: new Date()};
        } else {
            console.log("Already turned on, should not happen!");
        }
    };

    turnOff() {
        if (this.state == "On") {
            this.status = {state: false, setAt: new Date(), offTill: this.status.offTill};
            this.setTimer();
        } else {
            console.log("Already turned off, should not happen!");
        }
    };

    turnOffFor(minutes) {
        let curDate = new Date();
        this.offTill = new Date(curDate.setSeconds(minutes + curDate.getSeconds()));
        //this.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
        this.turnOff();
    };

    turnOffForDay() {
        this.offTill = new Date(new Date().setHours(24, 0, 0, 0));
        this.turnOff();
    };

    turnOffFromBackground() {
        if (this.state == "On") {
            this.turnOffFor(this.interceptionInterval);
        }
    };

    turnExtensionBackOn() {
        storage.getSettings(function (settings) {
            if (settings.state == "Off") {
                settings.turnOn();
                synchronizer.syncSettings(settings);
            }
        });
    };

    setTimer() {
        let timerInMS = this.status.offTill - new Date();
        setTimeout(this.turnExtensionBackOn, timerInMS);
    };

    copySettings(settingsObject) {
        this.status = settingsObject.status;
        this.sessionID = settingsObject.sessionID;
        this.interceptionInterval = settingsObject.interceptionInterval;
        this.mode = settingsObject.mode;
    };

    reInitTimer() {
        if (this.state == "Off") {
            if (this.offTill < new Date()) {
                this.turnOn();
            } else {
                this.setTimer();
            }
        }
    };

    /* --------------- --------------- Serialization --------------- --------------- */

    static serializeSettings(settingsObject) {
            return JSON.stringify(settingsObject);
    }

    static parseSettingsObject(parsedSettingsObject) {
            let s = new UserSettings();
            parsedSettingsObject._status.setAt = new Date(parsedSettingsObject._status.setAt);
            parsedSettingsObject._status.offTill = new Date(parsedSettingsObject._status.offTill);
            s.status = parsedSettingsObject._status;
            s.sessionID = parsedSettingsObject._sessionID;
            s.interceptionInterval = parsedSettingsObject._interceptionInterval;
            s.mode = parsedSettingsObject._mode;
            return s;
    }

    static deserializeSettings (serializedSettingsObject) {
            if (serializedSettingsObject != null) {
                let parsed = JSON.parse(serializedSettingsObject);
                return this.parseSettingsObject(parsed);
            }
            return null;
    }

}

