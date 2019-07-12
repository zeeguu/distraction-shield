/* global chrome */

let BACKGROUND_CACHE = {
    enabled: true, // default value
    blockedUrls: [] // default value
};

chrome.storage.onChanged.addListener(changes => {
    setup();

    const { enabled, blockedUrls } = changes;
    // if designated parameter changed in storage.
    if (enabled) BACKGROUND_CACHE.enabled = enabled.newValue;
    if (blockedUrls) BACKGROUND_CACHE.blockedUrls = blockedUrls.newValue;
});

function refreshCache() {
    chrome.storage.sync.get(['enabled', 'blockedUrls'], res => {
        const { enabled, blockedUrls } = res;
        BACKGROUND_CACHE.enabled = enabled;
        BACKGROUND_CACHE.blockedUrls = blockedUrls;
    });
}

/* Re-initiate listeners when a timeout has passed. */
const timeoutHandlers = {};

function setTimeoutHandler(blockedUrl) {
    resetTimeoutHandler(blockedUrl);

    let { timeout, regex } = blockedUrl;
    let timeleft = timeout - new Date().valueOf();
    
    timeoutHandlers[regex] = setTimeout(() => {
        timeoutHandlers[regex] = null;
        setup();
    }, timeleft);
}

function resetTimeoutHandler(blockedUrl) {
    if (timeoutHandlers[blockedUrl.regex]) {
        clearTimeout(timeoutHandlers[blockedUrl.regex]);
        timeoutHandlers[blockedUrl.regex] = null;
    }
}

function isTimedOut(blockedUrl) {
    if (blockedUrl.timeout && new Date().valueOf() <= blockedUrl.timeout) {
        setTimeoutHandler(blockedUrl);
        return false;
    } else {
        resetTimeoutHandler(blockedUrl);
        return true;
    }
}

function setup() {
    return; // block setup.

    // remove
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);

    // interceptions
    chrome.storage.sync.get(['enabled', 'blockedUrls'], function(result) {
        let { enabled, blockedUrls } = result;

        // is app enabled
        if (enabled === false) return; // can be (undefined | null) too.

        // no urls to be blocked.
        if (!blockedUrls) return;

        // only block urls that are not timed out.
        let urls = blockedUrls.filter(isTimedOut)
                              .map(blockedUrl => blockedUrl.regex);

        // add listener
        chrome.webRequest.onBeforeRequest.addListener(handleInterception, {
                urls, // https://developer.chrome.com/extensions/match_patterns
                types: ["main_frame"]
            }, ["blocking"]
        );
    });
}

function handleInterception(details) {
    let params = new URLSearchParams();
    params.append('page', 'intercepted');
    params.append('url', details.url);

    let extensionUrl = chrome.runtime.getURL('index.html');
    let redirectUrl = `${extensionUrl}?${params.toString()}`;

    return { redirectUrl };
}

function oneTimeSetup() {
    refreshCache();

    chrome.tabs.onCreated.removeListener(tabHandler);
    chrome.tabs.onActivated.removeListener(tabActivated);
    chrome.tabs.onUpdated.removeListener(tabUpdated);

    chrome.tabs.onCreated.addListener(tabHandler);
    chrome.tabs.onActivated.addListener(tabActivated);
    chrome.tabs.onUpdated.addListener(tabUpdated);
}

function tabHandler(tab) {
    // chrome.storage.sync.get(['enabled', 'blockedUrls'], res => {
        // const { enabled, blockedUrls } = res;
        const { enabled, blockedUrls } = BACKGROUND_CACHE;

        if (enabled === false || !blockedUrls) return;

        blockedUrls.filter(isNotTimedOut)
                   .forEach(blockedUrl => {
            const pattern = parse(blockedUrl.regex);

            if (pattern.test(tab.url)) {
                redirect(tab);
                return;
            }
        });
    // });
}

function isNotTimedOut(blockedUrl) {
    return !(blockedUrl.timeout && new Date().valueOf() <= blockedUrl.timeout);
}

function redirect(tab) {
    let params = new URLSearchParams();
    params.append('page', 'intercepted');
    params.append('url', tab.url);

    let extensionUrl = chrome.runtime.getURL('index.html');
    let url = `${extensionUrl}?${params.toString()}`;

    chrome.tabs.update(tab.id, { url });
}

function tabActivated(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, tabHandler);
}

function tabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'loading') {
        tabHandler(tab);
    }
}

/* SOURCE: github.com/josefalcon/match-pattern */
// https: //github.com/josefalcon/match-pattern/blob/master/index.js
// Reference: https://developer.chrome.com/extensions/match_patterns
var scheme = "(\\*|http|https|file|ftp)";
var host = "(\\*|(?:\\*\\.)?(?:[^/*]+))?";
var path = "(.*)";
var regex = new RegExp(
    "^" +
    scheme +
    "://" +
    host +
    "/" +
    path +
    "$"
);

function parse(pattern) {
    var match = regex.exec(pattern);
    if (!match) return null;

    var scheme = match[1];
    var host = match[2];
    var path = match[3];

    if (!host && scheme !== 'file') return null;

    return makeRegExp(scheme, host, path);
}

function makeRegExp(scheme, host, path) {
    var regex = '^';
    if (scheme === '*') {
        regex += '(http|https)';
    } else {
        regex += scheme;
    }

    regex += "://";

    if (host) {
        if (host === '*') {
            regex += '[^/]+?';
        } else {
            if (host.match(/^\*\./)) {
                regex += '[^/]*?';
                host = host.substring(2);
            }
            regex += host.replace(/\./g, '\\.');
        }
    }

    if (path) {
        if (path === '*') {
            regex += '(/.*)?'
        } else if (path[0] !== '/') {
            regex += '/';
            regex += path.replace(/\*/g, '.*?');
            regex += '/?';
        }
    }

    regex += '$';
    return new RegExp(regex);
}
/* end of external source. */

oneTimeSetup();
setup();