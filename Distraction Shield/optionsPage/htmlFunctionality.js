import GreenToRedSlider from './classes/GreenToRedSlider'
import * as constants from '../constants'
import * as synchronizer from '../modules/synchronizer'

/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */

/* -------------------- Button Click functions ----------------------- */

//Connect functions to HTML elements
export function connectButton(html_button, method) {
    html_button.on('click', method);
}
/* -------------------- Keypress events ----------------------- */

export function setKeyPressFunctions(html_txtFld, blacklistTable, submitFunc, deleteFunc) {
    submitOnKeyPress(html_txtFld, submitFunc);
    deleteOnKeyPress(blacklistTable, deleteFunc);
}

export function submitOnKeyPress(html_elem, submitFunc) {
    html_elem.keyup((event) => {
        if (event.keyCode === constants.KEY_ENTER) {
            submitFunc();
        }
    });
}

export function deleteOnKeyPress(blacklistTable, deleteFunc) {
    $('html').keyup((e) => {
        if (e.keyCode === constants.KEY_DELETE) {
            let html = blacklistTable.getSelected();
            deleteFunc(html);
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
        synchronizer.syncSettings(settings_object);
    });
}
/* -------------------- Interval slider -------------------- */

export function initIntervalSlider(settings_object) {
    return new GreenToRedSlider('#interval-slider', function (value) {
        settings_object.interceptionInterval = parseInt(value);
        synchronizer.syncSettings(settings_object);
    });
}