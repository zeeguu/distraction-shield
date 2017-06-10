import * as constants from '../constants'
import * as storage from '../modules/storage/storage'
import * as logger from '../modules/logger'

/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */

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
}

function submitOnKeyPress(html_elem, submitFunc) {
    html_elem.keyup((event) => {
        if (event.keyCode === constants.KEY_ENTER) {
            submitFunc();
        }
    });
}

/* -------------------- Logic for the mode selection -------------------- */

export function initModeSelection(buttonGroup) {
    $("input[name=" + buttonGroup + "]").change(() => {
        storage.getSettings((settings_object) => {
            let selectedMode = $("input[name=" + buttonGroup + "]:checked").val();
            if (selectedMode === 'pro') {
                settings_object.mode = constants.modes.pro;
            } else {
                settings_object.mode = constants.modes.lazy;
            }
            storage.setSettings(settings_object);
            logger.logToFile(constants.logEventType.changed, `mode`, `${settings_object.mode.label}`, constants.logType.settings);
        });
    });
}
