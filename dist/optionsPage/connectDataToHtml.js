"use strict";

/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

sortListOnCheckboxVal = function sortListOnCheckboxVal(bsA, bsB) {
    var valueOfA = bsA.getCheckboxVal();
    var valueOfB = bsB.getCheckboxVal();
    if (valueOfA && !valueOfB) return -1;
    if (!valueOfA && valueOfB) return 1;
    return 0;
};

loadHtmlBlacklist = function loadHtmlBlacklist(blockedSiteList, table) {
    var list = blockedSiteList.getList();
    list.sort(sortListOnCheckboxVal);
    $.each(list, function (key, value) {
        table.addToTable(table.generateTableRow(value));
    });
};

loadHtmlMode = function loadHtmlMode(extensionMode, radioGroup) {
    $("input[name=" + radioGroup + "][value=" + extensionMode.label + "]").prop('checked', true);
};

loadHtmlInterval = function loadHtmlInterval(interceptInterval, html_slider) {
    html_slider.setValue(interceptInterval);
};

loadHtmlInterceptCounter = function loadHtmlInterceptCounter(count, html_counter) {
    html_counter.text(count);
};

connectLogin = function connectLogin() {
    $('#sessionGlyphIcon').removeClass('glyphicon-log-out').addClass('glyphicon-log-in');
    $('#sessionMessage').html('Enter email and password to login');
    $('#emailFld').show();
    $('#addon').removeClass('input-group-addon-logout-version');
    $('#addon').html('');
    $('#passwordFld').show();
    html_sessionBtn.off('click', logout);
    html_sessionBtn.on('click', login);
};

connectLogout = function connectLogout() {
    auth.getDetails().then(function (response) {
        //resolution
        var details = JSON.parse(response);
        $('#sessionMessage').html('');
        $('#sessionGlyphIcon').removeClass('glyphicon-log-in').addClass('glyphicon-log-out');
        $('#addon').addClass('input-group-addon-logout-version');
        $('#addon').html('You are logged in as ' + details.name);
        $('#emailFld').hide();
        $('#passwordFld').hide();
        html_sessionBtn.off('click', login);
        html_sessionBtn.on('click', logout);
    });
};