function GreenToRedSlider(sliderID) {
    var self = this;

    this.sliderDiv = $('#' + sliderID);
    this.inputRange = $(this.sliderDiv.children()[0]);
    this.value = $(this.sliderDiv.children()[1]);

    this.inputRange.on('input', function () {
        var inputValue = self.inputRange.val();
        self.value.html(inputValue);
        self.updateColor(inputValue);
        settings_object.interceptionInterval = parseInt(inputValue);
        updateStorageSettings();
        setBackgroundSettings();
    });

    this.updateColor = function(inputValue) {
        var maxSliderVal = (this.inputRange[0]).max;
        var redVal = Math.round(inputValue / maxSliderVal * 255);
        var greenVal = 255 - redVal;
        this.inputRange.css('background', 'rgb(' + redVal + ', ' + greenVal + ',0)');
    };

    this.setValue = function(val) {
        this.inputRange.val(val);
        this.value.html(val);
        this.updateColor(val);
    }
}