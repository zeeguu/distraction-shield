chrome.storage.onChanged.addListener(changes => {
    console.debug('chrome.storage.onChanged', changes);
    setup();
});

function setup() {
    console.debug('setup()');

    // remove
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);

    chrome.storage.sync.get(['blockedUrls'], function(result) {
        console.debug(result.blockedUrls);
        if (!result.blockedUrls) return; // no urls to be blocked.

        // add
        chrome.webRequest.onBeforeRequest.addListener(
            handleInterception
            , {
                // urls should be of type
                // https://developer.chrome.com/extensions/match_patterns
                // 
                urls: result.blockedUrls
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