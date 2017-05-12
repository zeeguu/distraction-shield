import * as $ from "../dependencies/jquery/jquery-1.10.2.js";
import * as synchronizer from "../modules/synchronizer.js";
import * as blockedSiteBuilder from "../modules/blockedSiteBuilder.js";

let saveButton = $('#saveBtn');
let optionsButton = $('#optionsBtn');
let statisticsButton = $('#statisticsBtn');

saveCurrentPageToBlacklist = function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let activeTab = arrayOfTabs[0];
        blockedSiteBuilder.createNewBlockedSite(activeTab.url, function (blockedSite) {
            if (synchronizer.addSiteAndSync(blockedSite)) {
                setSaveButtonToSuccess();
            }
        });
    });
};

redirectToStatistics = function () {
    chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
};

openOptionsPage = function () {
    chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
};

//Connect functions to HTML elements
connectButtons = function () {
    optionsButton.on('click', openOptionsPage);
    statisticsButton.on('click', redirectToStatistics);
    setSaveButtonFunctionality();
};

patternMatchUrl = function (url) {
    let list = bg.blockedSites.getList();
    let item;
    list.some(function (bl) {
        if (stringutil.wildcardStrComp(url, bl.getUrl())) {
            item = bl;
            return true;
        }
        return false;
    });
    return item;
};

toggleBlockedSite = function (url) {
    return function () {
        chrome.runtime.sendMessage({message: "requestBlockedSites"}, function (response) {
            let list = response.blockedSiteList;
            let newItem;
            for (let i = 0; i < list.getList().length; i++) {
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
    }
};

setSaveButtonToSuccess = function () {
    saveButton.attr('class', 'btn btn-success');
    saveButton.html('Added!');
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        setSaveButtonFunctionality();
    }, 3000);
};

setSaveButtonFunctionality = function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let activeTab = arrayOfTabs[0];
        let url = activeTab.url;
        let matchedBlockedSite = patternMatchUrl(url);
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

