// remove
chrome.webRequest.onBeforeRequest.removeListener(handleInterception);

// add
chrome.webRequest.onBeforeRequest.addListener(
    handleInterception
    , {
        urls: ['*://facebook.com/*']
        , types: ["main_frame"]
    }
    , ["blocking"]
);


function handleInterception(details) {
    return {
        redirectUrl: 'https://mircealungu.github.io'
    };
}