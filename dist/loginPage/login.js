'use strict';

var bg = chrome.extension.getBackgroundPage();
var auth = bg.auth;
/* -------------------- -------------------------- -------------------- */
var instructions;

var html_emailLoginFld = $('#emailLoginFld');
var html_passwordLoginFld = $('#passwordLoginFld');
var html_submitButton = $('#submitBtn');

var messageDialog = $('#message');
var spinner = $('.spinner');

login = function login() {
    messageDialog.text("");

    var email = html_emailLoginFld.val();
    var password = html_passwordLoginFld.val();

    spinner.show();
    auth.login(email, password).then(function (response) {
        auth.setSession(response);
        messageDialog.text("You logged in!");
        html_emailLoginFld.val('');
        if ("forceLogin" in instructions) {
            url = instructions["forceLogin"];
            url = url + "?sessionID=" + bg.localSettings.getSessionID() + "&redirect=" + instructions["redirect"];
            window.location = url;
        }
    }, function (error) {
        messageDialog.text("Wrong credentials..");
    }).then(function (response) {
        spinner.hide();
    }, function () {
        spinner.hide();
    });
    html_passwordLoginFld.val('');
};

getExtraInstructions = function getExtraInstructions() {
    var url = window.location.href;
    var urlParts = url.split(/\?/);
    var cleanUrl = urlParts[0];
    var params = urlParts[1];
    setUrlInAddressbar(cleanUrl);
    return getparametersDictionary(params);
};

getparametersDictionary = function getparametersDictionary(unsplitParams) {
    if (!unsplitParams) return {};
    var unsplitParamPairs = unsplitParams.split(/&/);
    var params = {};
    for (i in unsplitParamPairs) {
        var splitParam = unsplitParamPairs[i].split(/=/);
        params[splitParam[0]] = splitParam[1];
    }
    return params;
};

setUrlInAddressbar = function setUrlInAddressbar(newUrl) {
    window.history.pushState('', document.title, newUrl);
};

loginOnEnter = function loginOnEnter(html_elem) {
    html_elem.keyup(function (event) {
        if (event.keyCode == KEY_ENTER) {
            login();
        }
    });
};

//Connect functions to HTML elements
connectButton = function connectButton(html_button, method) {
    html_button.on('click', method);
};

connectHtmlFunctionality = function connectHtmlFunctionality() {
    connectButton(html_submitButton, login);
    loginOnEnter(html_passwordLoginFld.parent());
};

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function () {
    instructions = getExtraInstructions();
    connectHtmlFunctionality();
});