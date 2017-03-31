var greenToRedSlider = function () {
    var slider = $('.range-slider'),
        range = $('.range-slider__range'),
        value = $('.range-slider__value');

    slider.each(function () {
        value.each(function () {
            var value = $(this).prev().attr('value');
            $(this).html(value);
        });

        range.on('input', function () {
            var inputValue = this.value;
            var maxSliderVal = this.max;
            $(this).next(value).html(inputValue);
            var redVal = Math.round(inputValue / maxSliderVal * 255);
            var greenVal = 255 - redVal;
            $(this).css('background', 'rgb(' + redVal + ', ' + greenVal + ',0)');
        });
    });
};

greenToRedSlider();
