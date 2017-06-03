import * as constants from "../../constants"

/**
 * class that connects a <div> with a span and slider together with all the funcitonality.
 * I.E. changing colour, updating eachother's values and functionality to be added to the html_elements
 */
export default class GreenToRedSlider {

    //TODO replace saveFunction with storage interaction?
    constructor(sliderID, saveFunction) {
        this.saveValue = saveFunction;
        this.sliderDiv = $(sliderID);
        this.sliderRange = $(this.sliderDiv.find(sliderID + "-range"));
        this.sliderValue = $(this.sliderDiv.find(sliderID + "-value"));

        this.setOnEventFunc();
    }

    setOnEventFunc() {
        this.sliderRange.on('input', () => {
            let inputValue = this.sliderRange.val();
            this.sliderValue.html(this.calculateHours(inputValue));
            this.updateColor(inputValue);
        });

        this.sliderRange.on('mouseup',  () => {
            let inputValue = this.sliderRange.val();
            this.saveValue(inputValue);
        });

        this.sliderValue.on('blur', () => {
            this.checkTimeValidity($(this.sliderValue).html());
        });

        this.sliderValue.keydown(event => {
            if (event.keyCode === constants.KEY_ENTER) {
                this.sliderValue.blur();
                event.preventDefault();
            }
        });
    }

    /**
     * update the colour of the slider according to the inputValue
     * @param {int} inputValue
     */
    updateColor(inputValue) {
        let maxSliderVal = (this.sliderRange[0]).max;
        let redVal = Math.round(inputValue / maxSliderVal * 120);
        let greenVal = 120 - redVal;
        this.sliderRange.css('background', 'rgb(' + redVal + ', ' + greenVal + ',0)');
    }

    setValue(val) {
        this.sliderRange.val(val);
        this.sliderValue.html(this.calculateHours(val));
        this.updateColor(val);
    }

    /**
     * format a value in minutes to Hours and minutes.
     */
    calculateHours(val) {
        let hours = Math.floor(val / 60);
        let minutes = val % 60;
        if (minutes < 10 && hours > 0)
            minutes = "0" + minutes;
        return this.createMessage(hours, minutes, val);
    }

    createMessage(hours, minutes){
        return (hours > 0 ? hours + ":" + minutes + " hours" : minutes + " minute(s)");
    }


    /**
     * function that checks the validity of the value inputted in the editable span
     * @param val
     */
    checkTimeValidity(val) {
        let regex = (/(\d+|\d\:\d{2})(?:\s*)(h(?:our)?s?|m(?:inute|in)?s?|$)/m).exec(val);
        if (regex !== null) {
            if (regex[1].match(":")) {
                let split = regex[1].split(":");
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

    timeInputError() {
        this.setValue(this.sliderRange.val());
        chrome.extension.getBackgroundPage().alert("please input a supported time format");
    }
}