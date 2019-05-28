chrome.storage.onChanged.addListener(changes => {
    setup();
});


function setup() {
    // remove
    chrome.webRequest.onBeforeRequest.removeListener(handleInterception);

    chrome.storage.sync.get(['blockedUrls'], function(result) {
        // add
        chrome.webRequest.onBeforeRequest.addListener(
            handleInterception
            , {
                urls: result.blockedUrls
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