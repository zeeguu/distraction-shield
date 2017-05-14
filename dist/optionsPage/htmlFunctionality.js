'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.appendHtmlItemTo = appendHtmlItemTo;
exports.prependHtmlItemTo = prependHtmlItemTo;
exports.connectButton = connectButton;
exports.setKeyPressFunctions = setKeyPressFunctions;
exports.submitOnKeyPress = submitOnKeyPress;
exports.deleteOnKeyPress = deleteOnKeyPress;
exports.initModeSelection = initModeSelection;
exports.initIntervalSlider = initIntervalSlider;

var _GreenToRedSlider = require('./classes/GreenToRedSlider');

var _GreenToRedSlider2 = _interopRequireDefault(_GreenToRedSlider);

var _constants = require('../constants');

var constants = _interopRequireWildcard(_constants);

var _synchronizer = require('../modules/synchronizer');

var synchronizer = _interopRequireWildcard(_synchronizer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */

function appendHtmlItemTo(html_child, html_parent) {
    html_parent.append(html_child);
}

function prependHtmlItemTo(html_child, html_parent) {
    html_parent.prepend(html_child);
}
/* -------------------- Button Click functions ----------------------- */

//Connect functions to HTML elements
function connectButton(html_button, method) {
    html_button.on('click', method);
}
/* -------------------- Keypress events ----------------------- */

function setKeyPressFunctions(html_txtFld, blacklistTable, submitFunc, deleteFunc) {
    submitOnKeyPress(html_txtFld, submitFunc);
    deleteOnKeyPress(blacklistTable, deleteFunc);
}
function submitOnKeyPress(html_elem, submitFunc) {
    html_elem.keyup(function (event) {
        if (event.keyCode === constants.KEY_ENTER) {
            submitFunc();
        }
    });
}
function deleteOnKeyPress(blacklistTable, deleteFunc) {
    $('html').keyup(function (e) {
        if (e.keyCode === constants.KEY_DELETE) {
            var html = blacklistTable.getSelected();
            deleteFunc(html);
        }
    });
}
/* -------------------- Logic for the mode selection -------------------- */

function initModeSelection(buttonGroup, settings_object) {
    $("input[name=" + buttonGroup + "]").change(function () {
        var selectedMode = $("input[name=" + buttonGroup + "]:checked").val();
        if (selectedMode === 'pro') {
            settings_object.mode = constants.modes.pro;
        } else {
            settings_object.mode = constants.modes.lazy;
        }
        synchronizer.syncSettings(settings_object);
    });
}
/* -------------------- Interval slider -------------------- */

function initIntervalSlider(settings_object) {
    return new _GreenToRedSlider2.default('#interval-slider', function (value) {
        settings_object.interceptionInterval = parseInt(value);
        synchronizer.syncSettings(settings_object);
    });
}