import * as synchronizer from "../modules/synchronizer.js";
import * as blockedSiteBuilder from "../modules/blockedSiteBuilder.js";
import * as stringutil from "../modules/stringutil.js";
import BlockedSiteList from '../classes/BlockedSiteList';

let saveButton = $('#saveBtn');
let optionsButton = $('#optionsBtn');
let statisticsButton = $('#statisticsBtn');

function redirectToStatistics () {
    chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
}

function openOptionsPage () {
    chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
}

//Connect functions to HTML elements
function  connectButtons() {
    optionsButton.on('click', openOptionsPage);
    statisticsButton.on('click', redirectToStatistics);
    setSaveButtonFunctionality();
}

function patternMatchUrl (url, callback) {
    chrome.runtime.sendMessage({message: "requestBlockedSites"}, function (response) {
        let siteList = BlockedSiteList.deserializeBlockedSiteList(response.blockedSiteList);
        let list = siteList.list;
        let item = null;
        list.some(function (bl) {
            if (stringutil.wildcardStrComp(url, bl.url)) {
                item = bl;
                return true;
            }
            return false;
        });
        callback(item);
    });
}

function toggleBlockedSite (url) {
    return function () {
        chrome.runtime.sendMessage({message: "requestBlockedSites"}, function (response) {
            let siteList = BlockedSiteList.deserializeBlockedSiteList(response.blockedSiteList);
            let list = siteList.list;
            let newItem = null;
            for (let i = 0; i < list.length; i++) {
                if (stringutil.wildcardStrComp(url, list[i].url)) {
                    newItem = list[i];
                    break;
                }
            }
            newItem.checkboxVal = !newItem.checkboxVal;
            if (newItem.checkboxVal) {
                saveButton.text("Unblock");
            } else {
                saveButton.text("Block");
            }
            synchronizer.syncBlacklist(siteList);
        });
    }
}

function setSaveButtonToSuccess () {
    let saveButton = $('#saveBtn');
    saveButton.attr('class', 'btn btn-success');
    saveButton.text('Added!');
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        setSaveButtonFunctionality();
    }, 3000);
}

function saveCurrentPageToBlacklist () {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let activeTab = arrayOfTabs[0];
        blockedSiteBuilder.createNewBlockedSite(activeTab.url, function (blockedSite) {
            synchronizer.addSiteAndSync(blockedSite, setSaveButtonToSuccess());
        });
    });
}

function setSaveButtonFunctionality () {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let activeTab = arrayOfTabs[0];
        let url = activeTab.url;
        patternMatchUrl(url, function (matchedBlockedSite) {

            if (matchedBlockedSite != null) {
                saveButton.unbind('click', saveCurrentPageToBlacklist);
                saveButton.on('click', toggleBlockedSite(url));
                if (matchedBlockedSite.checkboxVal) {
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
    });

}

connectButtons();

