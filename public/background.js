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

        let urls = blockedUrls
            .filter(blockedUrl => {
                let { timeout } = blockedUrl;
                // filters out blocked urls that currently have a timeout.
                return !(timeout && new Date().valueOf() <= timeout);
            })
            .map(blockedUrl => blockedUrl.regex);

        // add
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