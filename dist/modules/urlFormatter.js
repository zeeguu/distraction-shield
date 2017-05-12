'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stripOfFinalSlash = stripOfFinalSlash;
exports.stripOfScheme = stripOfScheme;
exports.stripOfPort = stripOfPort;
exports.stripOfFileName = stripOfFileName;
exports.getDomainOnly = getDomainOnly;
exports.stripOfAll = stripOfAll;
exports.formatForGetRequest = formatForGetRequest;
exports.getUrlFromServer = getUrlFromServer;
exports.httpGetAsync = httpGetAsync;
exports.readyStateChange = readyStateChange;
exports.errorHandler = errorHandler;

var _constants = require('/Distraction Shield/constants');

var constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// use alert for warning popups
alert = chrome.extension.getBackgroundPage().alert;

// Fire a request for the actual url from server. Then go on to fire the passed callback with
// the newly found url
function stripOfFinalSlash(url) {
    if (url[url.length - 1] == '/') {
        var ans = url.split("");
        ans.pop();
        url = ans.join("");
    }
    return url;
}

function stripOfScheme(url) {
    var schemeless = url;
    if (url.indexOf("://") > -1) {
        schemeless = url.split('://')[1];
    }
    schemeless = stripOfFinalSlash(schemeless);
    return schemeless;
}

function stripOfPort(url) {
    var portless = [];
    if (url.indexOf(":") > -1) {
        var splittedUrl = url.split(':');
        portless.push(splittedUrl[0]);
        splittedUrl.shift();
        splittedUrl = splittedUrl[0].split('/');
        splittedUrl.shift();
        splittedUrl = splittedUrl.join('/');
        portless.push('/' + splittedUrl + '/');
        url = portless.join("");
    }
    url = stripOfFinalSlash(url);
    return url;
}

function stripOfFileName(url) {
    if (url.indexOf("/") > -1) {
        var nameless = url.split("").reverse().join("");
        nameless = nameless.split(['/']);
        var stripped = [];
        for (var i = 1; i < nameless.length; i++) {
            stripped.push('/');
            stripped.push(nameless[i]);
        }
        stripped = stripped.join("").split("").reverse().join("");
        stripped = stripOfFinalSlash(stripped);
        return stripped;
    } else {
        url = stripOfFinalSlash(url);
        return url;
    }
}

function getDomainOnly(url) {
    if (url.indexOf("/") > -1) {
        return url.split("/")[0];
    } else {
        return url;
    }
}

function stripOfAll(url) {
    url = stripOfScheme(url);
    url = stripOfFinalSlash(url);
    url = stripOfPort(url);
    url = stripOfFileName(url);
    url = stripOfFinalSlash(url);
    //return a tuple of the actual url and only the =: "www.website.com"
    return [url, getDomainOnly(url)];
}

function formatForGetRequest(url) {
    var strippedUrl = stripOfAll(url);
    return "http://" + strippedUrl[0];
}

function getUrlFromServer(url, callback) {
    var urlToGet = formatForGetRequest(url);
    httpGetAsync(urlToGet, function (url, title) {
        url = stripOfScheme(url);
        url = stripOfFileName(url);
        callback(url, title);
    });
}

function httpGetAsync(theUrlToGet, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrlToGet, true); // true for asynchronous
    xmlHttp.onreadystatechange = function () {
        readyStateChange(xmlHttp, callback);
    };
    xmlHttp.send(null);
}

function readyStateChange(xmlHttp, callback) {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        // simple regex to extract data from title tags, ignoring newlines, tabs and returns
        var titleTags = /<title.*?>(?:[\t\n\r]*)([\w\W]*?)(?:[\t\n\r]*)<\/title>/m.exec(xmlHttp.responseText);
        if (titleTags != null) {
            var title = titleTags[1];
            callback(xmlHttp.responseURL, title);
        } else {
            callback(xmlHttp.responseURL, theUrlToGet);
        }
    } else if (xmlHttp.readyState == 4) {
        errorHandler(xmlHttp.status);
    }
}

function errorHandler(status) {
    switch (status) {
        case 404:
            alert(constants.INVALID_URL_MESSAGE + 'File not found');
            break;
        case 500:
            alert(constants.INVALID_URL_MESSAGE + 'Server error');
            break;
        case 0:
            alert(constants.INVALID_URL_MESSAGE + 'Request aborted');
            break;
        default:
            alert(constants.INVALID_URL_MESSAGE + 'Unknown error ' + status);
    }
}