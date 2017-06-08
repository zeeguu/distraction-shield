/**
 * This function uses the chrome tabs api to see if a tab is open with a certain url.
 * Calls the callback with: the id of the tab if a tab is open with the given url, false otherwise
 * @param {string} url Url to check for
 * @param {function} callback Function to call with the result of the search
 */
export function isOpenTab (url, callback) {

    chrome.tabs.query({}, (tabs) => {
        console.log("chrome.tabs.query called");
        for (let t of tabs) {
            if (t.url == url) {
                callback(t.id);
                return;
            }
        }
        callback(false);
    });
}

/**
 * A function that opens a tab with a given url, only if none is open yet,
 * switches to the already open tab otherwise
 * @param {string} url Url to check for
 */
export function openTabSingleton(url, callback = () => {}) {
    console.log("\topenTabsingleton called");
    isOpenTab(url, (result) => {
        console.log("\t\tisOpenTab returned")
        if (result === false) {//meaning: tab not yet open
            console.log("\t\t\ttab create called");
            chrome.tabs.create({url : url});
        } else {
            console.log("\t\t\ttab update called");
            chrome.tabs.update(result, {active: true});
        }
        callback();
    });
}