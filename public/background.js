chrome.storage.onChanged.addListener(changes => {
    setup();
});

function setup() {
    // remove
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);

    // interceptions
    chrome.storage.sync.get(['enabled', 'blockedUrls'], function(result) {
        // is app enabled
        if (result.enabled === false) return; // can be (undefined | null) too.

        // no urls to be blocked.
        if (!result.blockedUrls) return;

        // let filtr = result.blockedUrls.filter(blockedUrl => blockedUrl.enabled);
        let urls = result.blockedUrls.map(blockedUrl => blockedUrl.regex);

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