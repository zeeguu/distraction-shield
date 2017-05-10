define ('GreenToRedSlider', ['jquery', 'constants'], function GreenToRedSlider($, constants) {
    function GreenToRedSlider(sliderID, saveFunction) {
        var alert = chrome.extension.getBackgroundPage().alert;
        var self = this;

        this.saveValue = saveFunction;
        this.sliderDiv = $(sliderID);
        this.sliderRange = $(this.sliderDiv.find(sliderID + "-range"));
        this.sliderValue = $(this.sliderDiv.find(sliderID + "-value"));

        this.sliderRange.on('input', function () {
            var inputValue = self.sliderRange.val();
            self.sliderValue.html(self.calculateHours(inputValue));
            self.updateColor(inputValue);
        });

        this.sliderRange.on('mouseup', function () {
            var inputValue = self.sliderRange.val();
            self.saveValue(inputValue);
        });

        this.updateColor = function(inputValue) {
            var maxSliderVal = (this.sliderRange[0]).max;
            var redVal = Math.round(inputValue / maxSliderVal * 120);
            var greenVal = 120 - redVal;
            this.sliderRange.css('background', 'rgb(' + redVal + ', ' + greenVal + ',0)');
        };

        this.setValue = function(val) {
            this.sliderRange.val(val);
            this.sliderValue.html(self.calculateHours(val));
            this.updateColor(val);
        };

        this.calculateHours = function(val) {
            var hours = Math.floor(val / 60);
            var minutes = val % 60;
            if (minutes < 10 && hours > 0) {
                minutes = "0" + minutes;
            }
            return (hours > 0 ? hours + ":" + minutes + " hours" : minutes + " minute(s)");
        };

        this.sliderValue.on('blur', function () {
            self.checkTimeValidity($(this).html());
        });

        this.sliderValue.keydown(function (event) {
            if (event.keyCode == constants.KEY_ENTER) {
                self.sliderValue.blur();
                event.preventDefault();
            }
        });

        this.checkTimeValidity = function (val) {
            var regex = (/(\d+|\d\:\d{2})(?:\s*)(h(?:our)?s?|m(?:inute|in)?s?|$)/m).exec(val);
            if (regex != null) {
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
                    self.setValue(this.sliderRange[0].max < regex[1] ? this.sliderRange[0].max : regex[1]);
                } else {
                    self.timeInputError();
                }
            } else {
                self.timeInputError();
            }
        };

        this.timeInputError = function () {
            self.setValue(self.sliderRange.val());
            alert("please input a supported time format");
        }
    }

     return {
        GreenToRedSlider : GreenToRedSlider
     }


});