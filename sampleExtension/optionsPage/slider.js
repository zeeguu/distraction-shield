var MAX_SLIDER_VAL = 60;

var rangeSlider = function () {
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
            $(this).next(value).html(inputValue);
            var redVal = Math.round(inputValue / MAX_SLIDER_VAL * 255) ;
            var greenVal = 255 - redVal;
            $('input[type=range]').css('background', 'rgb(' + redVal + ', ' + greenVal + ',0)');
        });
    });
};

rangeSlider();
