'use strict';

var _constants = require('../constants');

var constants = _interopRequireWildcard(_constants);

var _storage = require('../modules/storage');

var storage = _interopRequireWildcard(_storage);

var _jquery = require('../dependencies/jquery/jquery-1.10.2');

var $ = _interopRequireWildcard(_jquery);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

mainFlow = function mainFlow() {
    storage.getMode(initBasis);
};

initBasis = function initBasis(mode) {
    var message = mode.zeeguuText;

    $.ajax({
        url: chrome.extension.getURL('contentInjection/inject.html'),
        type: "GET",
        timeout: 5000,
        datatype: "html",
        success: function success(data) {
            infoDiv = $.parseHTML(data);
            $("body").after(infoDiv);
            $("#tds_infoDiv").css('max-width', '800px');
            $("#tds_generalInfoText").append(constants.zeeguuInfoText);
            $("#tds_modeSpecificText").append(message);
            $("#originalDestination").attr("href", getDest());
        }
    });
};

getDest = function getDest() {
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