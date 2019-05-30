chrome.storage.onChanged.addListener(changes => {
    setup();
});

function setup() {
    // remove
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);

    chrome.storage.sync.get(['blockedUrls'], function(result) {
        if (!result.blockedUrls) return; // no urls to be blocked.

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
    return {
        redirectUrl: 'https://www.zeeguu.org/'
    };
}

setup();