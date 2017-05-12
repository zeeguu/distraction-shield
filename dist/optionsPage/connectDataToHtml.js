"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sortListOnCheckboxVal = sortListOnCheckboxVal;
exports.loadHtmlBlacklist = loadHtmlBlacklist;
exports.loadHtmlMode = loadHtmlMode;
exports.loadHtmlInterval = loadHtmlInterval;
exports.loadHtmlInterceptCounter = loadHtmlInterceptCounter;

var _jquery = require("../dependencies/jquery/jquery-1.10.2");

var $ = _interopRequireWildcard(_jquery);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

function sortListOnCheckboxVal(bsA, bsB) {
    var valueOfA = bsA.checkboxVal;
    var valueOfB = bsB.checkboxVal;
    if (valueOfA && !valueOfB) return -1;
    if (!valueOfA && valueOfB) return 1;
    return 0;
}

function loadHtmlBlacklist(blockedSiteList, table) {
    var list = blockedSiteList.list;
    list.sort(sortListOnCheckboxVal);
    $.each(list, function (key, value) {
        table.addToTable(table.generateTableRow(value));
    });
}

function loadHtmlMode(extensionMode, radioGroup) {
    $("input[name=" + radioGroup + "][value=" + extensionMode.label + "]").prop('checked', true);
}

function loadHtmlInterval(interceptInterval, html_slider) {
    html_slider.setValue(interceptInterval);
}

function loadHtmlInterceptCounter(count, html_counter) {
    html_counter.text(count);
}