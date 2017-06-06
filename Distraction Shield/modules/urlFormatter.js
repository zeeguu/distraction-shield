import * as constants from '../constants';

// use alert for warning popups
// alert = chrome.extension.getBackgroundPage().alert;

/**
 * removes trailing space from url, if nothing is there returns url
 */
export function stripOfFinalSlash(url) {
    if (url[url.length - 1] == '/') {
        let ans = url.split("");
        ans.pop();
        url = ans.join("");
    }
    return url;
}

/**
 * removes scheme from url, if nothing is there returns url
 */
export function stripOfScheme(url) {
    let schemeless = url;
    if (url.indexOf("://") > -1) {
        schemeless = url.split('://')[1];
    }
    schemeless = stripOfFinalSlash(schemeless);
    return schemeless;
}

/**
 * removes port from url, if nothing is there returns url
 */
export function stripOfPort(url) {
    let portless = [];
    if (url.indexOf(":") > -1) {
        let splittedUrl = url.split(':');
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

/**
 * removes filename from url, if nothing is there returns url
 */
export function stripOfFileName(url) {
    if (url.indexOf("/") > -1) {
        let nameless = url.split("").reverse().join("");
        nameless = nameless.split(['/']);
        let stripped = [];
        for (let i = 1; i < nameless.length; i++) {
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

/**
 * removes scheme, final slash, port and filename from url, returns tuple of new url and the domain of the url
 */
export function stripOfAll(url) {
    url = stripOfScheme(url);
    url = stripOfFinalSlash(url);
    url = stripOfPort(url);
    url = stripOfFileName(url);
    url = stripOfFinalSlash(url);
    //return a tuple of the actual url and only the =: "www.website.com"
    return [url, getDomainOnly(url)];
}

function formatForGetRequest(url) {
    let strippedUrl = stripOfAll(url);
    return "http://" + strippedUrl[0];
}

/**
 * fires any valid url and gets the end destination's url and page title. These are passed as arguments in the callback
 * @param {string} url the url to check
 * @param {function} callback the callback function that takes the newly formatted end-url together with it's page title as argument.
 * Used in the BlockedSiteBuilder
 */
export function getUrlFromServer(url, callback) {
    let urlToGet = formatForGetRequest(url);
    httpGetAsync(urlToGet, function (url, title) {
        url = stripOfScheme(url);
        url = stripOfFileName(url);
        callback(url, title);
    });
}

/**
 * fire asynchronous get request to find the end port of the passed url
 */
function httpGetAsync(theUrlToGet, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrlToGet, true); // true for asynchronous
    xmlHttp.onreadystatechange = function () {
        readyStateChange(xmlHttp, callback);
    };
    xmlHttp.send(null);
}

/**
 * function to be passed to the get-request
 */
function readyStateChange(xmlHttp, callback) {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        // simple regex to extract data from title tags, ignoring newlines, tabs and returns
        let titleTags = (/<title.*?>(?:[\t\n\r]*)([\w\W]*?)(?:[\t\n\r]*)<\/title>/m).exec(xmlHttp.responseText);
        if (titleTags != null) {
            let title = titleTags[1];
            callback(xmlHttp.responseURL, title);
        } else {
            callback(xmlHttp.responseURL, theUrlToGet);
        }
    } else if (xmlHttp.readyState == 4) {
        errorHandler(xmlHttp.status);
    }
}

/**
 * internal error handler
 */
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