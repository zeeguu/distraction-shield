import * as constants from '../constants'
import * as storage from '../modules/storage'

/**
 * Object holding all the data that is connected to the user's preferences.
 * Furthermore has the funcionality to turn the interception part of the of extension on or off.
 * Since the current state is saved here too.
 */
export default class UserSettings {
    constructor() {
        this._status = {
            state: true,
            setAt: new Date(),
            offTill: new Date()
        };

        this._mode = constants.modes.lazy;
        this._interceptionInterval = 1;
    }

    set interceptionInterval(val) {
        this._interceptionInterval = val;
    }

    get interceptionInterval() {
        return this._interceptionInterval;
    }

    set mode(newMode) {
        this._mode = newMode;
    }

    get mode() {
        return this._mode;
    }

    set status(newStatus) {
        this._status = newStatus;
    }

    get status() {
        return this._status;
    }

    get offTill() {
        return this._status.offTill;
    }

    set offTill(time) {
        this._status.offTill = time;
    }

    get state() {
        return this.status.state ? "On" : "Off";
    }

    get notState() {
        return this._status.state ? "Off" : "On";
    }

    /**
     * Turn the interception back on
     */
    turnOn() {
        if (this.state == "Off") {
            this.status = {state: true, setAt: new Date(), offTill: new Date()};
        } else {
            console.log("Already turned on, should not happen!");
        }
    }

    /**
     * Turn interception off
     * @param {boolean} timer should we set a timer, for when to turn on? (true for background, false for third party page)
     * @param {function} callback function to be called once the timer has finished (null when timer == false)
     */
    turnOff(timer, callback) {
        if (this.state == "On") {
            this.status = {state: false, setAt: new Date(), offTill: this.status.offTill};
            if (timer) {
                this.setTimer(callback);
            }
        } else {
            console.log("Already turned off, should not happen!");
        }
    }

    turnOffFor(minutes, timer, callback) {
        let curDate = new Date();
        this.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
        this.turnOff(timer, callback);
    }

    turnOffForDay(timer, callback) {
        this.offTill = new Date(new Date().setHours(24, 0, 0, 0));
        this.turnOff(timer, callback);
    }

    /**
     * Special case needed for turning the extension off from the background
     * @param {function} callback callbac function to be called once the timer turns interception back on
     */
    turnOffFromBackground(callback) {
        if (this.state == "On") {
            this.turnOffFor(this.interceptionInterval, true, callback);
        }
    }

    turnExtensionBackOn(callback) {
        return () => {
            if (this.state == "Off") {
                this.turnOn();
                storage.setSettings(this);
                callback();
            }
        };
    }

    setTimer(callback) {
        let timerInMS = this.status.offTill - new Date();
        setTimeout(this.turnExtensionBackOn(callback), timerInMS);
    }

    copySettings(settingsObject) {
        this._status = settingsObject.status;
        this._interceptionInterval = settingsObject.interceptionInterval;
        this._mode = settingsObject.mode;
    }

    reInitTimer(callback) {
        if (this.state == "Off") {
            if (this.offTill < new Date()) {
                this.turnOn();
                storage.setSettings(this);
                callback();
            } else {
                this.setTimer(callback);
            }
        }
    }

    /* --------------- --------------- Serialization --------------- --------------- */

    static serializeSettings(settingsObject) {
        return JSON.stringify(settingsObject);
    }

    static parseSettingsObject(parsedSettingsObject) {
        let s = new UserSettings();
        parsedSettingsObject._status.setAt = new Date(parsedSettingsObject._status.setAt);
        parsedSettingsObject._status.offTill = new Date(parsedSettingsObject._status.offTill);
        s.status = parsedSettingsObject._status;
        s.interceptionInterval = parsedSettingsObject._interceptionInterval;
        s.mode = parsedSettingsObject._mode;
        return s;
    }

    static deserializeSettings(serializedSettingsObject) {
        if (serializedSettingsObject != null) {
            let parsed = JSON.parse(serializedSettingsObject);
            return this.parseSettingsObject(parsed);
        }
        return null;
    }

}
