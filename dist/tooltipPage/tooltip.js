"use strict";

var _jquery = require("../dependencies/jquery/jquery-1.10.2.js");

var $ = _interopRequireWildcard(_jquery);

var _synchronizer = require("../modules/synchronizer.js");

var synchronizer = _interopRequireWildcard(_synchronizer);

var _blockedSiteBuilder = require("../modules/blockedSiteBuilder.js");

var blockedSiteBuilder = _interopRequireWildcard(_blockedSiteBuilder);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var saveButton = $('#saveBtn');
var optionsButton = $('#optionsBtn');
var statisticsButton = $('#statisticsBtn');

saveCurrentPageToBlacklist = function saveCurrentPageToBlacklist() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        blockedSiteBuilder.createNewBlockedSite(activeTab.url, function (blockedSite) {
            if (synchronizer.addSiteAndSync(blockedSite)) {
                setSaveButtonToSuccess();
            }
        });
    });
};

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
    var item = void 0;
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
        chrome.runtime.sendMessage({ message: "requestBlockedSites" }, function (response) {
            var list = response.blockedSiteList;
            var newItem = void 0;
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
        });
    };
};

setSaveButtonToSuccess = function setSaveButtonToSuccess() {
    saveButton.attr('class', 'btn btn-success');
    saveButton.html('Added!');
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        setSaveButtonFunctionality();
    }, 3000);
};

setSaveButtonFunctionality = function setSaveButtonFunctionality() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        var url = activeTab.url;
        var matchedBlockedSite = patternMatchUrl(url);
        if (matchedBlockedSite != null) {
            saveButton.unbind('click', saveCurrentPageToBlacklist);
            saveButton.on('click', toggleBlockedSite(url));
            if (matchedBlockedSite.getCheckboxVal()) {
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