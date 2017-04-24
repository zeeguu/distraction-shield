var console = chrome.extension.getBackgroundPage().console;

function GreenToRedSlider(sliderID, saveFunction) {
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
        var redVal = Math.round(inputValue / maxSliderVal * 220);
        var greenVal = 220 - redVal;
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

    this.sliderValue.keyup(function (event) {
        if (event.keyCode == KEY_ENTER) {
            self.checkTimeValidity($(this).html());
        }
    });

    this.checkTimeValidity = function (val) {
        var regex = (/(\d+)(?:\s*)(hours?|minutes?|$)/m).exec(val);
        if (regex[1] > 0){
            if (regex[2].match("hour")) {
                regex[1] *= 60;
            }
            self.setValue(regex[1]);
        }
    };

}