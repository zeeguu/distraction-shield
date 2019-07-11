/* global chrome */

chrome.storage.onChanged.addListener(changes => {
    setup();
});

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
        let urls = blockedUrls
            .filter(isTimedOut)
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

setup();