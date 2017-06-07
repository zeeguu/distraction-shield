import GreenToRedSlider from './GreenToRedSlider'
import UserSettings from '../../classes/UserSettings'
import * as constants from '../../constants'
import * as storage from '../../modules/storage/storage'

/**
 * subclass of the GreenToRedSlider, this also connects a button to the set of html_elements.
 * Furthermore it connects a userSettings item and fires functions according to the values of the
 * html_elements in order to manipulate the settings and let the user specify what he/she wants from the extension
 */
export default class TurnOffSlider extends GreenToRedSlider {

    constructor(sliderID) {
        super(sliderID, (value) => {
            this.selectedTime = parseInt(value);
        });
        this.selectedTime = 10;
        this.offButton = $(this.sliderDiv.find(sliderID + "-offBtn"));
        this.sliderRange[0].max = constants.MAX_TURN_OFF_TIME;
        this.offButton[0].slider = this;
        this.sliderValue.html(this.calculateHours(this.sliderRange.val()));
        this.setValue(this.sliderRange.val());
        this.init();
        chrome.storage.onChanged.addListener(changes => {
            this.handleStorageChange(changes)
        });
    }

    init(){
        storage.getSettings(settings_object => {
            this.updateSettings(settings_object);
        });
    }

    toggleShowOffMessage(settings_object) {
        if (!settings_object.isInterceptionOn()) {
            this.sliderValue.html(this.createOffMessage(settings_object));
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


    static formatDate(date) {
        let arr = date.toString().split(" ");
        return arr.splice(0, 5).join(" ");
    }

    createMessage(hours, minutes, val){
        if (val == constants.MAX_TURN_OFF_TIME)
            return "for the rest of the day";
        let returnVal = "for " + (hours > 0 ? hours + ":" + minutes + " hours." : minutes + " minute(s).");
        return returnVal;
    }

    createOffMessage(settings_object) {
        return "Turned off until: " + TurnOffSlider.formatDate(settings_object.status.offTill);
    }


    updateSettings(userSettings) {
        this.toggleShowOffMessage(userSettings);
        this.offButton.text("Turn " + (userSettings.isInterceptionOn() ? "Off" : "On"));
    }

    offButtonFunc() {
        storage.getSettings(settings_object => {
            // 'this' is really annoying, (this refers to the offbutton..)
            let slider = this.slider;
            if (settings_object.isInterceptionOn()) {
                if (slider.selectedTime === constants.MAX_TURN_OFF_TIME) {
                    settings_object.turnOffForDay();
                } else {
                    settings_object.turnOffFor(slider.selectedTime);
                }
            } else {
                settings_object.turnOn();
            }
            storage.setSettings(settings_object);
        });
    }

    handleStorageChange(changes){
        if (constants.tds_settings in changes) {
            let newSettings = UserSettings.deserializeSettings(changes[constants.tds_settings].newValue);
            this.updateSettings(newSettings);
        }
    }
}