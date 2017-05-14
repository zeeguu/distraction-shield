'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GreenToRedSlider = require('./GreenToRedSlider');

var _GreenToRedSlider2 = _interopRequireDefault(_GreenToRedSlider);

var _constants = require('../../constants');

var constants = _interopRequireWildcard(_constants);

var _synchronizer = require('../../modules/synchronizer');

var synchronizer = _interopRequireWildcard(_synchronizer);

var _htmlFunctionality = require('../htmlFunctionality');

var htmlFunctionality = _interopRequireWildcard(_htmlFunctionality);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TurnOffSlider = function () {
    function TurnOffSlider(sliderID, settings_object) {
        _classCallCheck(this, TurnOffSlider);

        this.selectedTime = 10;
        this.slider = new _GreenToRedSlider2.default(sliderID, function (value) {
            this.selectedTime = parseInt(value);
        });
        this.offButton = $(this.slider.sliderDiv.find(sliderID + "-offBtn"));
        this.settings_object = settings_object;
        this.offButton[0].turnOffSlider = this;
        this.init();
    }

    _createClass(TurnOffSlider, [{
        key: 'toggleShowOffMessage',
        value: function toggleShowOffMessage() {
            var sl = this.slider;
            if (this.settings_object.state === "Off") {
                sl.sliderValue.html(this.createHtmlOffMessage());
                sl.sliderRange.css('visibility', 'hidden').parent().css('display', 'none');
                sl.sliderValue.parent().css('width', '50%');
                sl.sliderValue.prop('contenteditable', false);
            } else {
                sl.sliderValue.html(sl.calculateHours(this.selectedTime));
                sl.sliderRange.css('visibility', 'visible').parent().css('display', 'initial');
                sl.sliderValue.parent().css('width', '30%');
                sl.sliderValue.prop('contenteditable', true);
            }
        }
    }, {
        key: 'createHtmlOffMessage',
        value: function createHtmlOffMessage() {
            return "Turned off until: " + TurnOffSlider.formatDate(this.settings_object.status.offTill);
        }
    }, {
        key: 'setSliderHourFunc',
        value: function setSliderHourFunc() {
            this.slider.calculateHours = function (val) {
                var hours = Math.floor(val / 60);
                var minutes = val % 60;
                if (minutes < 10 && hours > 0) {
                    minutes = "0" + minutes;
                }
                var returnVal = "for " + (hours > 0 ? hours + ":" + minutes + " hours." : minutes + " minute(s).");
                if (val === constants.MAX_TURN_OFF_TIME) {
                    returnVal = "for the rest of the day";
                }
                return returnVal;
            };
        }
    }, {
        key: 'turnOff',
        value: function turnOff() {
            var parent = this.turnOffSlider;
            var settings_object = parent.settings_object;
            if (settings_object.state === "On") {
                if (parent.selectedTime === constants.MAX_TURN_OFF_TIME) {
                    settings_object.turnOffForDay();
                } else {
                    settings_object.turnOffFor(parent.selectedTime);
                }
            } else {
                settings_object.turnOn();
            }
            parent.toggleShowOffMessage();
            $(this).text("Turn " + settings_object.notState);
            synchronizer.syncSettings(settings_object);
        }
    }, {
        key: 'init',
        value: function init() {
            var sl = this.slider;
            sl.sliderRange[0].max = constants.MAX_TURN_OFF_TIME;
            this.setSliderHourFunc();
            sl.sliderValue.html(sl.calculateHours(sl.sliderRange.val()));
            sl.setValue(sl.sliderRange.val());
            this.toggleShowOffMessage();
            this.offButton.text("Turn " + this.settings_object.notState);
            htmlFunctionality.connectButton(this.offButton, this.turnOff);
        }
    }], [{
        key: 'formatDate',
        value: function formatDate(date) {
            var arr = date.toString().split(" ");
            return arr.splice(0, 5).join(" ");
        }
    }]);

    return TurnOffSlider;
}();

exports.default = TurnOffSlider;