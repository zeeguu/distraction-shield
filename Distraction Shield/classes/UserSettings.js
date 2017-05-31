import * as constants from '../constants'
import * as storage from '../modules/storage'

/**
 * Class that hols all the information about the user settings
 */
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

    set sessionID(newID) {
        this._sesionID = newID;
    }

    get sessionID() {
        return this._sesionID;
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
     * Turns on the extension
     */
    turnOn() {
        if (this.state == "Off") {
            this.status = {state: true, setAt: new Date(), offTill: new Date()};
        } else {
            console.log("Already turned on, should not happen!");
        }
    }

    /**
     * Turns off the extension for a certain time. Used in
     * After that time, the callback function is called.
     * This function is used also in:
     * @see turnOffFor
     * @param {boolean} timer If the time expired
     * @param callback The function to be called after that time
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

    /**
     * Turn off the extension for a certain amount of time.
     * @param minutes The time period
     * @param {boolean} timer If the time expired
     * @param callback The function to be called after that time
     */
    turnOffFor(minutes, timer, callback) {
        let curDate = new Date();
        this.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
        this.turnOff(timer, callback);
    }

    /**
     * Turns off the extension for 1 day
     * @param {boolean} timer If the time expired
     * @param callback The function to be called after that
     */
    turnOffForDay(timer, callback) {
        this.offTill = new Date(new Date().setHours(24, 0, 0, 0));
        this.turnOff(timer, callback);
    }

    /**
     * Turn off the extension for the interception interval.
     * @param callback The function to be called after that
     */
    turnOffFromBackground(callback) {
        if (this.state == "On") {
            this.turnOffFor(this.interceptionInterval, true, callback);
        }
    }

    /**
     * Turns the extension back on. And calls the function passed when turned off.
     * @param callback The function that is called
     * @returns {function(this:UserSettings)}
     */
    turnExtensionBackOn(callback) {
        return function () {
            if (this.state == "Off") {
                this.turnOn();
                storage.setSettings(this);
                callback();
            }
        }.bind(this);
    }

    /**
     * Set timer for the interception intervals
     * @param callback
     */
    setTimer(callback) {
        let timerInMS = this.status.offTill - new Date();
        setTimeout(this.turnExtensionBackOn(callback), timerInMS);
    }

    /**
     * Copy the settings
     * @param settingsObject the settings object to be copied into this object
     */
    copySettings(settingsObject) {
        this._status = settingsObject.status;
        this._sessionID = settingsObject.sessionID;
        this._interceptionInterval = settingsObject.interceptionInterval;
        this._mode = settingsObject.mode;
    }

    /**
     * Reinitialize the timer and call the function.
     * @param callback The function to be called.
     */
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

    /**
     * Serialize this object
     * @param settingsObject
     */
    static serializeSettings(settingsObject) {
        return JSON.stringify(settingsObject);
    }

    /**
     * parese the settings Object
     * @param parsedSettingsObject The settings object that is not parsed
     * @returns {UserSettings} The parsed settings object
     */
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

    /**
     * Deserialize the settings object
     * @param serializedSettingsObject The object to be deserialized
     * @returns {*}
     */
    static deserializeSettings(serializedSettingsObject) {
        if (serializedSettingsObject != null) {
            let parsed = JSON.parse(serializedSettingsObject);
            return this.parseSettingsObject(parsed);
        }
        return null;
    }
}
