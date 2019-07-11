const timeoutHandlers = {};

chrome.storage.onChanged.addListener(changes => {
    setup();
});

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

        let willTimeout = [];
        let urls = blockedUrls
            // filters out blocked urls that currently have a timeout.
            .filter(blockedUrl => {
                let { timeout } = blockedUrl;

                if (timeout && new Date().valueOf() <= timeout) {
                    willTimeout.push(blockedUrl);
                    return false;
                } else {
                    if (timeoutHandlers[blockedUrl.regex]) { // handler still set
                        console.log('timeout cleared for ', blockedUrl.hostname);
                        clearTimeout(timeoutHandlers[blockedUrl.regex]);
                        timeoutHandlers[blockedUrl.regex] = null;
                    }
                    return true;
                }
            })
            .map(blockedUrl => blockedUrl.regex);
        
        // set timeout handlers
        willTimeout.forEach(blockedUrl => {
            let { timeout, regex } = blockedUrl;

            if (timeoutHandlers[regex]) { // handler already set
                clearTimeout(timeoutHandlers[blockedUrl.regex]);
                timeoutHandlers[blockedUrl.regex] = null;
            }

            let timeleft = timeout - new Date().valueOf();
            console.log('timeout set for ', blockedUrl.hostname);
            timeoutHandlers[regex] = setTimeout(() => {
                console.log('timeout triggered for ', blockedUrl.hostname);
                setup();
                timeoutHandlers[regex] = null;
            }, timeleft);
        });

        // add listener
        chrome.webRequest.onBeforeRequest.addListener(
            handleInterception
            , {
                // urls should be of type
                // https://developer.chrome.com/extensions/match_patterns
                // 
                urls
                //*://*.instagram.com/* // format example.
                , types: ["main_frame"]
            }
            , ["blocking"]
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