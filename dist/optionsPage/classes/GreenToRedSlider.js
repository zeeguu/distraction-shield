"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); //import * as $ from "../../dependencies/jquery/jquery-1.10.2";


var _constants = require("../../constants");

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GreenToRedSlider = function () {
    function GreenToRedSlider(sliderID, saveFunction) {
        _classCallCheck(this, GreenToRedSlider);

        this.alert = chrome.extension.getBackgroundPage().alert;
        var self = this;
        this.saveValue = saveFunction;
        this.sliderDiv = $(sliderID);
        this.sliderRange = $(this.sliderDiv.find(sliderID + "-range"));
        this.sliderValue = $(this.sliderDiv.find(sliderID + "-value"));

        this.sliderRange.on('input', function () {
            var inputValue = self.sliderRange.val();
            self.sliderValue.html(GreenToRedSlider.calculateHours(inputValue));
            self.updateColor(inputValue);
        });

        this.sliderRange.on('mouseup', function () {
            var inputValue = self.sliderRange.val();
            self.saveValue(inputValue);
        });

        this.sliderValue.on('blur', function () {
            self.checkTimeValidity($(this).html());
        });

        this.sliderValue.keydown(function (event) {
            if (event.keyCode === constants.KEY_ENTER) {
                self.sliderValue.blur();
                event.preventDefault();
            }
        });
    }

    _createClass(GreenToRedSlider, [{
        key: "updateColor",
        value: function updateColor(inputValue) {
            var maxSliderVal = this.sliderRange[0].max;
            var redVal = Math.round(inputValue / maxSliderVal * 120);
            var greenVal = 120 - redVal;
            this.sliderRange.css('background', 'rgb(' + redVal + ', ' + greenVal + ',0)');
        }
    }, {
        key: "setValue",
        value: function setValue(val) {
            this.sliderRange.val(val);
            this.sliderValue.html(GreenToRedSlider.calculateHours(val));
            this.updateColor(val);
        }
    }, {
        key: "checkTimeValidity",
        value: function checkTimeValidity(val) {
            var regex = /(\d+|\d\:\d{2})(?:\s*)(h(?:our)?s?|m(?:inute|in)?s?|$)/m.exec(val);
            if (regex !== null) {
                if (regex[1].match(":")) {
                    var split = regex[1].split(":");
                    regex[1] = parseInt(split[0]) + parseInt(split[1]) / 60;
                }
                if (regex[1] > 0) {
                    if (regex[2].match("hour")) {
                        regex[1] *= 60;
                    }
                    // round minutes to a valid number.
                    regex[1] = Math.round(regex[1]);
                    this.setValue(this.sliderRange[0].max < regex[1] ? this.sliderRange[0].max : regex[1]);
                } else {
                    this.timeInputError();
                }
            } else {
                this.timeInputError();
            }
        }
    }, {
        key: "timeInputError",
        value: function timeInputError() {
            this.setValue(this.sliderRange.val());
            this.alert("please input a supported time format");
        }
    }], [{
        key: "calculateHours",
        value: function calculateHours(val) {
            var hours = Math.floor(val / 60);
            var minutes = val % 60;
            if (minutes < 10 && hours > 0) {
                minutes = "0" + minutes;
            }
            return hours > 0 ? hours + ":" + minutes + " hours" : minutes + " minute(s)";
        }
    }]);

    return GreenToRedSlider;
}();

exports.default = GreenToRedSlider;