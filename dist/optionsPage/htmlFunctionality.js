'use strict';

/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */

appendHtmlItemTo = function appendHtmlItemTo(html_child, html_parent) {
    html_parent.append(html_child);
};

prependHtmlItemTo = function prependHtmlItemTo(html_child, html_parent) {
    html_parent.prepend(html_child);
};

/* -------------------- Button Click functions ----------------------- */

saveNewUrl = function saveNewUrl() {
    var newUrl = html_txtFld.val();
    blockedSiteBuilder.createNewBlockedSite(newUrl, addBlockedSiteToAll);
    html_txtFld.val('');
};

//Connect functions to HTML elements
connectButton = function connectButton(html_button, method) {
    html_button.on('click', method);
};

/* -------------------- Keypress events ----------------------- */

setKeyPressFunctions = function setKeyPressFunctions() {
    submitOnKeyPress(html_txtFld);
    deleteOnKeyPress(blacklistTable);
};

submitOnKeyPress = function submitOnKeyPress(html_elem) {
    html_elem.keyup(function (event) {
        if (event.keyCode == KEY_ENTER) {
            saveNewUrl();
        }
    });
};

deleteOnKeyPress = function deleteOnKeyPress(blacklistTable) {
    $('html').keyup(function (e) {
        if (e.keyCode == KEY_DELETE) {
            var html = blacklistTable.getSelected();
            removeBlockedSiteFromAll(html);
        }
    });
};

/* -------------------- Logic for the mode selection -------------------- */

initModeSelection = function initModeSelection(buttonGroup) {
    $("input[name=" + buttonGroup + "]").change(function () {
        settings_object.setMode($("input[name=" + buttonGroup + "]:checked").val());
        synchronizer.syncSettings(settings_object);
    });
};

/* -------------------- Interval slider -------------------- */

initIntervalSlider = function initIntervalSlider() {
    intervalSlider = new GreenToRedSlider('#interval-slider', function (value) {
        settings_object.setInterceptionInterval(parseInt(value));
        synchronizer.syncSettings(settings_object);
    });
};

login = function login() {
    var email = $('#emailFld').val();
    var password = $('#passwordFld').val();
    $('#passwordFld').val('');
    auth.login(email, password).then(function (response) {
        localSettings.setSessionID(response);
        auth.authenticateSession().then(function () {
            $('#emailFld').val('');
            $('#sessionMessage').html('You logged in succesfully');
            $('#html_sessionBtn').removeClass('btn-default').addClass('btn-success');
            $('#sessionGlyphIcon').removeClass('glyphicon-log-in').addClass('glyphicon-ok');
            setTimeout(updateSessionbutton, 1500);
        });
    }, function () {
        $('#sessionMessage').html('Wrong credentials, please try again...');
    });

    // chrome.tabs.create({'url': chrome.runtime.getURL('loginPage/login.html')});
};

logout = function logout() {
    auth.logout().then(function () {
        updateSessionbutton();
    });
};