import GreenToRedSlider from './GreenToRedSlider'
import * as constants from '../../constants'
import * as synchronizer from '../../modules/synchronizer'
import * as htmlFunctionality from '../htmlFunctionality'

export default class TurnOffSlider {

    constructor(sliderID, settings_object) {
        this.selectedTime = 10;
        this.slider = new GreenToRedSlider(sliderID, function (value) {
            this.selectedTime = parseInt(value);
        });
        this.offButton = $(this.slider.sliderDiv.find(sliderID + "-offBtn"));
        this.settings_object = settings_object;
        this.offButton[0].turnOffSlider = this;
        this.init();

    }

    toggleShowOffMessage() {
        let sl = this.slider;
        if (this.settings_object.state === "Off") {
            sl.sliderValue.html(this.createHtmlOffMessage());
            sl.sliderRange.css('visibility', 'hidden').parent().css('display', 'none');
            sl.sliderValue.parent().css('width', '50%');
            sl.sliderValue.prop('contenteditable', false);
        } else {
            sl.sliderValue.html(sl.calculateHours(this.selectedTime));
            sl.sliderRange.css('visibility', 'visible').parent().css('display', 'initial');
            sl.sliderValue.parent().css('width', '30%');
            sl.sliderValue.prop('contenteditable', true);
        }
    };

    createHtmlOffMessage() {
        return "Turned off until: " + TurnOffSlider.formatDate(this.settings_object.status.offTill);
    };

    static formatDate(date) {
        let arr = date.toString().split(" ");
        return arr.splice(0, 5).join(" ");
    };

    setSliderHourFunc() {
        this.slider.calculateHours = function (val) {
            let hours = Math.floor(val / 60);
            let minutes = val % 60;
            if (minutes < 10 && hours > 0) {
                minutes = "0" + minutes;
            }
            let returnVal = "for " + (hours > 0 ? hours + ":" + minutes + " hours." : minutes + " minute(s).");
            if (val === constants.MAX_TURN_OFF_TIME) {
                returnVal = "for the rest of the day";
            }
            return returnVal;
        };
    };

    turnOff() {
        let parent = this.turnOffSlider;
        let settings_object = parent.settings_object;
        if (settings_object.state === "On") {
            if (parent.selectedTime === constants.MAX_TURN_OFF_TIME) {
                settings_object.turnOffForDay();
            } else {
                settings_object.turnOffFor(parent.selectedTime);
            }
        } else {
            settings_object.turnOn();
        }
        parent.toggleShowOffMessage();
        $(this).text("Turn " + settings_object.notState);
        synchronizer.syncSettings(settings_object);
    };

    init() {
        let sl = this.slider;
        sl.sliderRange[0].max = constants.MAX_TURN_OFF_TIME;
        this.setSliderHourFunc();
        sl.sliderValue.html(sl.calculateHours(sl.sliderRange.val()));
        sl.setValue(sl.sliderRange.val());
        this.toggleShowOffMessage();
        this.offButton.text("Turn " + this.settings_object.notState);
        htmlFunctionality.connectButton(this.offButton, this.turnOff);
    };
}