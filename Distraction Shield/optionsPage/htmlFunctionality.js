import GreenToRedSlider from './classes/GreenToRedSlider'
import * as blockedSiteBuilder from '../modules/blockedSiteBuilder'
import * as constants from '../constants'
import * as synchronizer from '../modules/synchronizer'
//import * as $ from "../dependencies/jquery/jquery-1.10.2";

/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */
let html_txtFld = $('#textFld');

export function appendHtmlItemTo(html_child, html_parent) {
    html_parent.append(html_child);
}

export function prependHtmlItemTo(html_child, html_parent) {
    html_parent.prepend(html_child);
}
/* -------------------- Button Click functions ----------------------- */

export function saveNewUrl() {
    let newUrl = html_txtFld.val();
    blockedSiteBuilder.createNewBlockedSite(newUrl, addBlockedSiteToAll);
    html_txtFld.val('');
}
//Connect functions to HTML elements
export function connectButton(html_button, method) {
    html_button.on('click', method);
}
/* -------------------- Keypress events ----------------------- */

export function setKeyPressFunctions(html_txtFld, blacklistTable) {
    submitOnKeyPress(html_txtFld);
    deleteOnKeyPress(blacklistTable);
}
export function submitOnKeyPress(html_elem) {
    html_elem.keyup(function (event) {
        if (event.keyCode === constants.KEY_ENTER) {
            saveNewUrl();
        }
    });
}
export function deleteOnKeyPress(blacklistTable) {
    $('html').keyup(function (e) {
        if (e.keyCode === constants.KEY_DELETE) {
            let html = blacklistTable.getSelected();
            removeBlockedSiteFromAll(html);
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
    return new GreenToRedSlider.GreenToRedSlider('#interval-slider', function (value) {
        settings_object.interceptionInterval = parseInt(value);
        synchronizer.syncSettings(settings_object);
    });
}