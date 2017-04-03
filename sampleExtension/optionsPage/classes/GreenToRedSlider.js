
function GreenToRedSlider(sliderID, saveFunction) {
    var self = this;

    this.saveValue = saveFunction;
    this.sliderDiv = $(sliderID);
    this.inputRange = $(this.sliderDiv.children()[0]);
    this.value = $(this.sliderDiv.children()[1]);

    this.inputRange.on('input', function () {
        var inputValue = self.inputRange.val();
        self.value.html(self.calculateHours(inputValue));
        self.updateColor(inputValue);
    });

    this.inputRange.on('mouseup', function () {
        var inputValue = self.inputRange.val();
        self.saveValue(inputValue);
    });

    this.updateColor = function(inputValue) {
        var maxSliderVal = (this.inputRange[0]).max;
        var redVal = Math.round(inputValue / maxSliderVal * 255);
        var greenVal = 255 - redVal;
        this.inputRange.css('background', 'rgb(' + redVal + ', ' + greenVal + ',0)');
    };

    this.setValue = function(val) {
        this.inputRange.val(val);
        this.value.html(self.calculateHours(val));
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