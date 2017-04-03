
/* -------------------- TurnOff slider -------------------- */
function TurnOffSlider(sliderDivID) {
    var self = this;
    this.slider = new GreenToRedSlider('#turnOff-slider');
    this.offButton = $(sliderDivID).children().children('#offBtn');
    this.selectedTime = 10;

    this.toggleShowOffMessage = function() {
        if (settings_object.getState() == "Off") {
            appendHtmlItemTo(this.createHtmlOffMessage(), this.getParentDiv());
        } else {
            this.getParentDiv().children('#offTillTimestamp').remove();
        }
    };

    this.formatDate = function(date) {
        var arr = date.toString().split(" ");
        arr.pop();
        arr.pop();
        return arr.join(" ");
    };

    this.getParentDiv = function() {
        return this.offButton.parent();
    };

    this.createHtmlOffMessage = function() {
        var message = "Turned off until: " + this.formatDate(settings_object.getOffTill());
        return "<div id='offTillTimestamp'>" + "<br>" + message + "</div>";
    };

    this.setSliderValueFunc = function() {
        this.slider.saveValue = function(value) {
            self.selectedTime = parseInt(value);
        };
    };

    this.setSliderHourFunc = function() {
        this.slider.calculateHours = function(val) {
            var hours = Math.floor(val / 60);
            var minutes = val % 60;
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            var returnVal = hours + ":" + minutes + " hours.";
            if (val == MAX_TURN_OFF_TIME) {
                returnVal = "the rest of the day";
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

    this.init = function() {
        if (settings_object.getState() == "Off") {
            appendHtmlItemTo(this.createHtmlOffMessage(), this.getParentDiv());
        }
        this.offButton.text("Turn " + settings_object.getNotState());
        this.slider.inputRange[0].max = MAX_TURN_OFF_TIME;
        this.setSliderValueFunc();
        this.setSliderHourFunc();
        connectButton(this.offButton, this.turnOff);
    };

    this.init();
}

