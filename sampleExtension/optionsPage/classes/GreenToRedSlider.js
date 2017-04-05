//Adhere to this structure in the html:
//sliderID = "variableName-slider"
//sliderRange = "variableName-slider-range"
//sliderValue = "variableName-slider-value"

function GreenToRedSlider(sliderID, saveFunction) {
    var self = this;

    this.saveValue = saveFunction;
    this.sliderDiv = $(sliderID);
    this.sliderRange = $(this.sliderDiv.children(sliderID + "-range"));
    this.sliderValue = $(this.sliderDiv.children(sliderID + "-value"));

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
        var redVal = Math.round(inputValue / maxSliderVal * 255);
        var greenVal = 255 - redVal;
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
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes + " hours.";
    };
}