'use strict';

var bg = chrome.extension.getBackgroundPage();

var saveButton = $('#saveBtn');
var optionsButton = $('#optionsBtn');
var statisticsButton = $('#statisticsBtn');

redirectToStatistics = function redirectToStatistics() {
    chrome.tabs.create({ 'url': chrome.runtime.getURL('statisticsPage/statistics.html') });
};

openOptionsPage = function openOptionsPage() {
    chrome.tabs.create({ 'url': chrome.runtime.getURL('optionsPage/options.html') });
};

//Connect functions to HTML elements
connectButtons = function connectButtons() {
    optionsButton.on('click', openOptionsPage);
    statisticsButton.on('click', redirectToStatistics);
    setSaveButtonFunctionality();
};

patternMatchUrl = function patternMatchUrl(url) {
    var list = bg.blockedSites.getList();
    var item;
    list.some(function (bl) {
        if (stringutil.wildcardStrComp(url, bl.getUrl())) {
            item = bl;
            return true;
        }
        return false;
    });
    return item;
};

toggleBlockedSite = function toggleBlockedSite(url) {
    return function () {
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
            saveButton.text("Disable blocking this page");
        } else {
            saveButton.text("Enable blocking this page");
        }
        synchronizer.syncBlacklist(list);
    };
};

saveCurrentPageToBlacklist = function saveCurrentPageToBlacklist() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        bg.addUrlToBlockedSites(activeTab.url, setSaveButtonToSuccess);
    });
};

setSaveButtonToSuccess = function setSaveButtonToSuccess() {
    saveButton.attr('class', 'btn btn-success');
    saveButton.html('Successfully added!');
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        saveButton.html(' Save current page ');
    }, 4000);
};

setSaveButtonFunctionality = function setSaveButtonFunctionality() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        var url = activeTab.url;
        var matchedBlockedSite = patternMatchUrl(url);
        if (matchedBlockedSite != null) {
            saveButton.on('click', toggleBlockedSite(url));
            if (matchedBlockedSite.getCheckboxVal()) {
                saveButton.text("Disable blocking this page");
            } else {
                saveButton.text("Enable blocking this page");
            }
        } else {
            saveButton.on('click', saveCurrentPageToBlacklist);
            saveButton.text("Save current page");
        }
    });
};

connectButtons();