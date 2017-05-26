import GreenToRedSlider from './GreenToRedSlider'
import * as constants from '../../constants'
import * as synchronizer from '../../modules/synchronizer'
import * as htmlFunctionality from '../htmlFunctionality'

export default class TurnOffSlider extends GreenToRedSlider {

    constructor(sliderID, settings_object) {

        super(sliderID, (value) => {
            this.selectedTime = parseInt(value);
        });
        this.selectedTime = 10;
        this.offButton = $(this.sliderDiv.find(sliderID + "-offBtn"));
        this.settings_object = settings_object;
        this.offButton[0].turnOffSlider = this;
        this.init();

    }

    toggleShowOffMessage() {
        if (this.settings_object.state === "Off") {
            this.sliderValue.html(this.createHtmlOffMessage());
            this.sliderRange.css('visibility', 'hidden').parent().css('display', 'none');
            this.sliderValue.parent().css('width', '50%');
            this.sliderValue.prop('contenteditable', false);
        } else {
            this.sliderValue.html(this.calculateHours(this.selectedTime));
            this.sliderRange.css('visibility', 'visible').parent().css('display', 'initial');
            this.sliderValue.parent().css('width', '30%');
            this.sliderValue.prop('contenteditable', true);
        }
    }

    createHtmlOffMessage() {
        return "Turned off until: " + TurnOffSlider.formatDate(this.settings_object.status.offTill);
    }

    static formatDate(date) {
        let arr = date.toString().split(" ");
        return arr.splice(0, 5).join(" ");
    }

    setSliderHourFunc() {
        this.calculateHours = function (val) {
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
    }

    turnOff() {
        let parent = this.turnOffSlider;
        let settings_object = parent.settings_object;
        if (settings_object.state === "On") {
            if (parent.selectedTime === constants.MAX_TURN_OFF_TIME) {
                settings_object.turnOffForDay(false);
            } else {
                settings_object.turnOffFor(parent.selectedTime, false);
            }
        } else {
            settings_object.turnOn();
        }
        parent.toggleShowOffMessage();
        $(this).text("Turn " + settings_object.notState);
        synchronizer.syncSettings(settings_object);
    }

    init() {
        this.sliderRange[0].max = constants.MAX_TURN_OFF_TIME;
        this.setSliderHourFunc();
        this.sliderValue.html(this.calculateHours(this.sliderRange.val()));
        this.setValue(this.sliderRange.val());
        this.toggleShowOffMessage();
        this.offButton.text("Turn " + this.settings_object.notState);
        htmlFunctionality.connectButton(this.offButton, this.turnOff);
    }
}