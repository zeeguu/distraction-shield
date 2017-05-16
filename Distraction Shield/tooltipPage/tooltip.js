
var bg = chrome.extension.getBackgroundPage();

var saveButton = $('#saveBtn');
var optionsButton = $('#optionsBtn');
var statisticsButton = $('#statisticsBtn');

redirectToStatistics = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
};

openOptionsPage = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
};

//Connect functions to HTML elements
connectButtons = function() {
    optionsButton.on('click', openOptionsPage);
    statisticsButton.on('click', redirectToStatistics);
    setSaveButtonFunctionality();
};

patternMatchUrl = function(url) {
    var list = bg.blockedSites.getList();
    var item;
    list.some(function(bl) {
        if(stringutil.wildcardStrComp(url, bl.getUrl())) {
            item = bl;
            return true;
        }
        return false;
    });
    return item;
};

toggleBlockedSite = function(url) {
    return function() {
        var list = bg.blockedSites;
        var newItem;
        for (var i = 0; i < list.getList().length; i++) {
            if (stringutil.wildcardStrComp(url, list.getList()[i].getUrl())) {
                newItem = list.getList()[i];
                break;
            }
        }
        newItem.setCheckboxVal(!newItem.getCheckboxVal());
        if (newItem.getCheckboxVal()) {
            saveButton.text("Unblock");
        } else {
            saveButton.text("Block");
        }
        synchronizer.syncBlacklist(list);
    }
};

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        bg.addUrlToBlockedSites(activeTab.url, setSaveButtonToSuccess);
    });
};

setSaveButtonToSuccess = function () {
    saveButton.attr('class', 'btn btn-success');
    saveButton.html('Added!');
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        setSaveButtonFunctionality();
    }, 3000);
};



setSaveButtonFunctionality = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        var url = activeTab.url;
        var matchedBlockedSite = patternMatchUrl(url);
        if (matchedBlockedSite != null) {
            saveButton.unbind('click', saveCurrentPageToBlacklist);
            saveButton.on('click', toggleBlockedSite(url));
            if(matchedBlockedSite.getCheckboxVal()) {
                saveButton.text("Unblock");
            } else {
                saveButton.text("Block");
            }
        } else {
            saveButton.unbind('click', toggleBlockedSite(url));
            saveButton.on('click', saveCurrentPageToBlacklist);
            saveButton.text("Block");
        }
    });
};

connectButtons();
