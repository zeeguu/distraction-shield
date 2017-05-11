import * as constants from '../constants'

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
    set offTill(time) { this._status.offTill = time;}

    get state() {return this._status.state ? "On" : "Off";};

    //TODO  remove - unused?
    get notState() {return this._status.state ? "Off" : "On"; };

    turnOn() {
        if (this.state() === "Off") {
            this._status = {state: true, setAt: new Date(), offTill: new Date()};
        } else {
            console.log("Already turned on, should not happen!");
        }
    };

    turnOff() {
        if (this.state() === "On") {
            this._status = {state: false, setAt: new Date(), offTill: status.offTill};
            this.setTimer();
        } else {
            console.log("Already turned off, should not happen!");
        }
    };

    turnOffFor(minutes) {
        let curDate = new Date();
        let timer = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
        this.offTill = timer;
        this.turnOff();
    };

    turnOffForDay  () {
        let time = new Date(new Date().setHours(24, 0, 0, 0));
        this.offTill = time;
        this.turnOff();
    };

    turnOffFromBackground  () {
        if (this.state() === "On") {
            let curDate = new Date();
            let newOffTill = new Date(curDate.setMinutes(this.interceptionInterval + curDate.getMinutes()));
            this._status = {state: false, setAt: new Date(), offTill: newOffTill};
            this.setTimer();
        }
    };

    turnExtensionBackOn  () {
        if (this.state === "Off") {
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
        if (this.state() === "Off") {
            if (this.offTill < new Date()) {
                this.turnOn();
            } else {
                this.setTimer();
            }
        }
    };
}

    /* --------------- --------------- Serialization --------------- --------------- */

    //Private to this and storage.js
export function serializeSettings (settingsObject){
        let obj = {
            status: settingsObject.status,
            sessionID: settingsObject.sessionID,
            mode: settingsObject.mode,
            interceptionInterval: settingsObject.interceptionInterval
        };
        return JSON.stringify(obj);
}

    //Private method
export function parseSettingsObject (parsedSettingsObject){
        let s = new UserSettings();
        let newStatus = parsedSettingsObject.status;
        newStatus.setAt = new Date(newStatus.setAt);
        newStatus.offTill = new Date(newStatus.offTill);

        s.status = newStatus;
        s.mode = parsedSettingsObject.mode;
        s.sessionID = parsedSettingsObject.sessionID;
        s.interceptionInterval = parsedSettingsObject.interceptionInterval;
        return s;
}
//Private to this and storage.js
export function deserializeSettings (serializedSettingsObject){
        if (serializedSettingsObject !== null) {
            let parsed = JSON.parse(serializedSettingsObject);
            return parseSettingsObject(parsed);
        }
        return null;
}
