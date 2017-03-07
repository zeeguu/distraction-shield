
//Set that holds the urls to be intercepted
var blockedSites = null;

initExtension = function () {
    //First receive the blacklist from the sync storage, and then create a onBeforeRequest listener using this list.
    updateBlockedSites(replaceListener);
};

replaceListener = function() {
    chrome.runtime.onMessage.removeListener(messageListener);
    chrome.runtime.onMessage.addListener(messageListener);
};

messageListener = function(request, sender, sendResponse) {
    if(request.message == 'loaded') {
        var check = 0;
        for (var i = 0; i < blockedSites.length; i++) {
            var x = sender.tab.url.split(['//'])[1].split(['/'])[0];
            var y = blockedSites[i].split(['//'])[1].split(['/'])[0];
            if (x == y) {
                check = 1;
                incrementInterceptionCounter();
            }
        }
        sendResponse({val: check});
    }
};

// This method receives the blacklist from the sync storage.
updateBlockedSites = function(callback){
    chrome.storage.sync.get("blacklist", function (items) {
        if (!chrome.runtime.error) {
            blockedSites = items.blacklist;
            return callback();
        }
    });
};

incrementInterceptionCounter = function() {
    chrome.storage.sync.get("interceptCounter", function(output) {
        var counter = output.interceptCounter;
        counter++;
        chrome.storage.sync.set({"interceptCounter": counter}, function () {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
        });
    });
};

//Initialize our extension when installed, such that the storage holds an empty list
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get("blacklist", function(output) {
        if (output.blacklist == null) {
            chrome.storage.sync.set({"blacklist": []}, function () {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        }
    });
    chrome.storage.sync.get("interceptCounter", function(output) {
        if (output.interceptCounter == null) {
            chrome.storage.sync.set({"interceptCounter": 0}, function () {
                if (chrome.runtime.error) {
                    console.log("Runtime error.");
                }
            });
        }
    });
});

initExtension();








