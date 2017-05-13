"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require("../constants");

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserSettings = function () {
    function UserSettings() {
        _classCallCheck(this, UserSettings);

        this._status = {
            state: true,
            setAt: new Date(),
            offTill: new Date()
        };

        this._sesionID = undefined;
        this._mode = constants.modes.lazy;
        this._interceptionInterval = 1;
    }

    _createClass(UserSettings, [{
        key: "turnOn",
        value: function turnOn() {
            if (this.state() === "Off") {
                this.status = { state: true, setAt: new Date(), offTill: new Date() };
            } else {
                console.log("Already turned on, should not happen!");
            }
        }
    }, {
        key: "turnOff",
        value: function turnOff() {
            if (this.state() === "On") {
                this.status = { state: false, setAt: new Date(), offTill: status.offTill };
                this.setTimer();
            } else {
                console.log("Already turned off, should not happen!");
            }
        }
    }, {
        key: "turnOffFor",
        value: function turnOffFor(minutes) {
            var curDate = new Date();
            this.offTill = new Date(curDate.setMinutes(minutes + curDate.getMinutes()));
            this.turnOff();
        }
    }, {
        key: "turnOffForDay",
        value: function turnOffForDay() {
            this.offTill = new Date(new Date().setHours(24, 0, 0, 0));
            this.turnOff();
        }
    }, {
        key: "turnOffFromBackground",
        value: function turnOffFromBackground() {
            if (this.state() === "On") {
                var curDate = new Date();
                var newOffTill = new Date(curDate.setMinutes(this.interceptionInterval + curDate.getMinutes()));
                this.status = { state: false, setAt: new Date(), offTill: newOffTill };
                this.setTimer();
            }
        }
    }, {
        key: "turnExtensionBackOn",
        value: function turnExtensionBackOn() {
            if (this.state === "Off") {
                this.turnOn();
            }
        }
    }, {
        key: "setTimer",
        value: function setTimer() {
            var timerInMS = this.status.offTill - new Date();
            setTimeout(this.turnExtensionBackOn, timerInMS);
        }
    }, {
        key: "copySettings",
        value: function copySettings(settingsObject) {
            this.status = settingsObject.status;
            this.sesionID = settingsObject.sessionID;
            this.interceptionInterval = settingsObject.interceptionInterval;
            this.mode = settingsObject.mode;
        }
    }, {
        key: "reInitTimer",
        value: function reInitTimer() {
            if (this.state() === "Off") {
                if (this.offTill < new Date()) {
                    this.turnOn();
                } else {
                    this.setTimer();
                }
            }
        }
    }, {
        key: "sessionID",
        set: function set(newID) {
            this._sesionID = newID;
        },
        get: function get() {
            return this._sesionID;
        }
    }, {
        key: "interceptionInterval",
        set: function set(val) {
            this._interceptionInterval = val;
        },
        get: function get() {
            return this._interceptionInterval;
        }
    }, {
        key: "mode",
        set: function set(newMode) {
            this._mode = newMode;
        },
        get: function get() {
            return this._mode;
        }
    }, {
        key: "status",
        set: function set(newStatus) {
            this._status = newStatus;
        },
        get: function get() {
            return this._status;
        }
    }, {
        key: "offTill",
        get: function get() {
            return this._status.offTill;
        },
        set: function set(time) {
            this._status.offTill = time;
        }
    }, {
        key: "state",
        get: function get() {
            return this._status.state ? "On" : "Off";
        }
    }, {
        key: "notState",


        //TODO  remove? - not unused, used in one of the intervalSliders, could do it through getState though
        get: function get() {
            return this._status.state ? "Off" : "On";
        }
    }], [{
        key: "serializeSettings",


        /* --------------- --------------- Serialization --------------- --------------- */

        value: function serializeSettings(settingsObject) {
            // let obj = {
            //     status: settingsObject.status,
            //     sessionID: settingsObject.sessionID,
            //     mode: settingsObject.mode,
            //     interceptionInterval: settingsObject.interceptionInterval
            // };
            return JSON.stringify(settingsObject); //TODO check if this works
        }
    }, {
        key: "parseSettingsObject",
        value: function parseSettingsObject(parsedSettingsObject) {
            var s = new UserSettings();
            parsedSettingsObject.status.setAt = new Date(newStatus.setAt);
            parsedSettingsObject.status.offTill = new Date(newStatus.offTill);
            s.copySettings(parsedSettingsObject);
            return s;
        }
    }, {
        key: "deserializeSettings",
        value: function deserializeSettings(serializedSettingsObject) {
            if (serializedSettingsObject !== null) {
                var parsed = JSON.parse(serializedSettingsObject);
                return this.parseSettingsObject(parsed);
            }
            return null;
        }
    }]);

    return UserSettings;
}();

exports.default = UserSettings;