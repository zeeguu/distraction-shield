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

require (['jquery', 'storage', 'constants'], function ($, storage, constants) {

    mainFlow = function () {
        storage.getMode(initBasis);
    };

    initBasis = function (mode) {
        var message = mode.zeeguuText;

        $.ajax({
            url: chrome.extension.getURL('contentInjection/inject.html'),
            type: "GET",
            timeout: 5000,
            datattype: "html",
            success: function (data) {
                infoDiv = $.parseHTML(data);
                $(".body").prepend(infoDiv);
                $("#tds").width(window.innerWidth + "px");
                $("#tds_generalInfoText").append(constants.zeeguuInfoText);
                $("#tds_modeSpecificText").append(message);
                $("#originalDestination").attr("href", getDest());
            }
        });
    };

    getDest = function () {
        var url = window.location.href;
        var regex = new RegExp("[?&]redirect(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results || !results[2]) {
            return null;
        }
        var newUrl = decodeURIComponent(results[2].replace(/\+/g, " "));
        if (newUrl.indexOf("?") > -1) {
            newUrl += "&tds_exComplete=true";
        } else {
            newUrl += "?tds_exComplete=true";
        }
        return newUrl;
    };

    mainFlow();
});