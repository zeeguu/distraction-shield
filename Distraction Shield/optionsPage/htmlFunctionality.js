import GreenToRedSlider from './classes/GreenToRedSlider'
import * as constants from '../constants'
import * as storage from '../modules/storage/storage'

// this is for testing purposes only!
import * as logger from '../modules/logger'



/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */
function setLoggingFunctions(){
    $('#printLogs').on('click', () => {
        logger.printLogs();
    })
    $('#deleteLogs').on('click', () => {
        logger.clearLogs();
    })
}


/* -------------------- Button Click functions ----------------------- */

/**
 * connect function to onclick property of html_item
 */
export function connectButton(html_button, method) {
    html_button.on('click', method);
}
/* -------------------- Keypress events ----------------------- */

export function setKeyPressFunctions(html_txtFld, submitFunc) {
    submitOnKeyPress(html_txtFld, submitFunc);
    // TESTING PURPOSES ONLY!
    setLoggingFunctions();
}

function submitOnKeyPress(html_elem, submitFunc) {
    html_elem.keyup((event) => {
        if (event.keyCode === constants.KEY_ENTER) {
            submitFunc();
        }
    });
}

/* -------------------- Logic for the mode selection -------------------- */

export function initModeSelection(buttonGroup, settings_object) {
    $("input[name=" + buttonGroup + "]").change(function () {
        let selectedMode = $("input[name=" + buttonGroup + "]:checked").val();
        if (selectedMode === 'pro') {
            settings_object.mode = constants.modes.pro;
        } else {
            settings_object.mode = constants.modes.lazy;
        }
        storage.setSettings(settings_object);
        logger.logToFile(`changed`, `mode`, `${settings_object.mode.label}`, 'settings');
    });
}
/* -------------------- Interval slider -------------------- */

export function initIntervalSlider(settings_object) {
    return new GreenToRedSlider('#interval-slider', function (value) {
        settings_object.interceptionInterval = parseInt(value);
        storage.setSettings(settings_object);
    });
}