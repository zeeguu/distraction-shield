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
        );;
    });

}

function handleInterception(details) {
    // use
    // new URLSearchParams(url.search.slice(1));
    // to construct...
    let redirectUrl = chrome.runtime.getURL('index.html?page=intercepted')

    return { redirectUrl };
}

setup();