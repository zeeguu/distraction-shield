
/* -------------------- TurnOff slider -------------------- */
function TurnOffSlider(sliderDivID) {
    var self = this;
    this.selectedTime = 10;
    this.slider = new GreenToRedSlider('#turnOff-slider', function(value) { self.selectedTime = parseInt(value); });
    this.offButton = $(sliderDivID).find('#offBtn');

    this.toggleShowOffMessage = function() {
        if (settings_object.getState() == "Off") {
            self.slider.value.html(self.createHtmlOffMessage());
            self.slider.sliderDiv.children('#turnOff-slider-range').css('visibility', 'hidden').css('display', 'none');
        } else {
            self.slider.value.html(self.slider.calculateHours(self.selectedTime));
            self.slider.sliderDiv.children('#turnOff-slider-range').css('visibility', 'visible').css('display', 'initial');
        }
    };

    this.formatDate = function(date) {
        var arr = date.toString().split(" ");
        return arr.splice(0, 5).join(" ");
    };

    this.createHtmlOffMessage = function() {
        return "Turned off until: " + this.formatDate(settings_object.getOffTill());
    };

    this.setSliderHourFunc = function() {
        this.slider.calculateHours = function(val) {
            var hours = Math.floor(val / 60);
            var minutes = val % 60;
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            var returnVal = "for " + hours + ":" + minutes + " hours.";
            if (val == MAX_TURN_OFF_TIME) {
                returnVal = "for the rest of the day";
            }
            return returnVal;
        };
    };

    this.turnOff = function() {
        if (settings_object.getState() == "On") {
            if (self.selectedTime == MAX_TURN_OFF_TIME) {
                settings_object.turnOffForDay();
            } else {
                settings_object.turnOffFor(self.selectedTime);
            }
        } else {
            settings_object.turnOn();
        }
        self.toggleShowOffMessage();
        self.offButton.text("Turn " + settings_object.getNotState());
    };

    this.init = function () {
        this.slider.value.html(this.slider.calculateHours(this.slider.inputRange.val()));
        this.toggleShowOffMessage();
        this.offButton.text("Turn " + settings_object.getNotState());
        this.slider.inputRange[0].max = MAX_TURN_OFF_TIME;
        this.setSliderHourFunc();
        connectButton(this.offButton, this.turnOff);
    };

    this.init();
}

