require.config({
    baseUrl: "./",
    paths : {
        'BlockedSite'       : '../classes/BlockedSite',
        'BlockedSiteList'   : '../classes/BlockedSiteList',
        'UserSettings'      : '../classes/UserSettings',
        'api'               : '../modules/authentication/api',
        'auth'              : '../modules/authentication/auth',
        'exerciseTime'      : '../modules/statistics/exerciseTime',
        'interception'      : '../modules/statistics/interception',
        'tracker'           : '../modules/statistics/tracker',
        'blockedSiteBuilder': '../modules/blockedSiteBuilder',
        'dateutil'          : '../modules/dateutil',
        'storage'           : '../modules/storage',
        'synchronizer'      : '../modules/synchronizer',
        'urlFormatter'      : '../modules/urlFormatter',
        'background'        : '../background',
        'constants'         : '../constants',
        'jquery'            : '../dependencies/jquery/jquery-1.10.2',
        'domReady'          : '../domReady'

    }
});

require (['background','auth', 'jquery', 'domReady', 'constants'], function (background,auth, $, domReady, constants) {
    /* -------------------- -------------------------- -------------------- */

    var instructions;

    var html_emailLoginFld = $('#emailLoginFld');
    var html_passwordLoginFld = $('#passwordLoginFld');
    var html_submitButton = $('#submitBtn');

    var messageDialog = $('#message');
    var spinner = $('.spinner');

    var authenticator = new auth.Auth();


    login = function () {

        messageDialog.text("");

        var email = html_emailLoginFld.val();
        var password = html_passwordLoginFld.val();

        spinner.show();

        authenticator.login(email, password).then(function (response) {
            authenticator.setSession(response);
            messageDialog.text("You logged in!");
            html_emailLoginFld.val('');
            if ("forceLogin" in instructions) {
                url = instructions["forceLogin"];
                url = url + "?sessionID=" + background.getLocalSettings.getSessionID() + "&redirect=" + instructions["redirect"];
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

    getExtraInstructions = function () {
        var url = window.location.href;
        var urlParts = url.split(/\?/);
        var cleanUrl = urlParts[0];
        var params = urlParts[1];
        setUrlInAddressbar(cleanUrl);
        return getParametersDictionary(params);
    };

    getParametersDictionary = function (unsplitParams) {
        if (!unsplitParams) return {};
        var unsplitParamPairs = unsplitParams.split(/&/);
        var params = {};
        for (i in unsplitParamPairs) {
            var splitParam = unsplitParamPairs[i].split(/=/);
            params[splitParam[0]] = splitParam[1];
        }
        return params;
    };

    setUrlInAddressbar = function (newUrl) {
        window.history.pushState('', document.title, newUrl);
    };

    loginOnEnter = function (html_elem) {
        html_elem.keyup(function (event) {
            if (event.keyCode == constants.KEY_ENTER) {
                login();
            }
        });
    };

    //Connect functions to HTML elements
    connectButton = function (html_button, method) {
        html_button.on('click', method);
    };

    connectHtmlFunctionality = function () {
        connectButton(html_submitButton, login);
        loginOnEnter(html_passwordLoginFld.parent());
    };

    domReady(function () {
            instructions = getExtraInstructions();
            connectHtmlFunctionality();
    });
});