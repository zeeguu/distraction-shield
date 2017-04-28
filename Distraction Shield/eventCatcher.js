
var onInstalledFired = false;

chrome.runtime.onInstalled.addListener(function() {
    onInstalledFired = true;
});