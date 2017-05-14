"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sortListOnCheckboxVal = sortListOnCheckboxVal;
exports.loadHtmlBlacklist = loadHtmlBlacklist;
exports.loadHtmlMode = loadHtmlMode;
exports.loadHtmlInterval = loadHtmlInterval;
exports.loadHtmlInterceptCounter = loadHtmlInterceptCounter;
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