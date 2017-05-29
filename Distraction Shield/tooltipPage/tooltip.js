import * as synchronizer from "../modules/synchronizer.js";
import * as blockedSiteBuilder from "../modules/blockedSiteBuilder.js";
import * as stringutil from "../modules/stringutil.js";
import BlockedSiteList from '../classes/BlockedSiteList';
import {openTabSingleton} from "../modules/tabutil";

let saveButton = $('#saveBtn');
let optionsButton = $('#optionsBtn');
let statisticsButton = $('#statisticsBtn');

function openStatisticsPage() {
    openTabSingleton(chrome.runtime.getURL('statisticsPage/statistics.html'));
    setTimeout(() => window.close(), 250);
}

function openOptionsPage() {
    openTabSingleton(chrome.runtime.getURL('optionsPage/options.html'));
    setTimeout(() => window.close(), 250);
}

//Connect functions to HTML elements
function connectButtons() {
    optionsButton.on('click', openOptionsPage);
    statisticsButton.on('click', openStatisticsPage);
    setSaveButtonFunctionality();
}

function patternMatchUrl(url, callback) {
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

function toggleBlockedSite(url) {
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
<<<<<<< HEAD
            synchronizer.syncBlacklist(siteList);
        });
=======
        }
        newItem.setCheckboxVal(!newItem.getCheckboxVal());
        if (newItem.getCheckboxVal()) {
            saveButton.text("Unblock");
        } else {
            saveButton.text("Block");
        }
        synchronizer.syncBlacklist(list);
>>>>>>> development
    }
}

function setSaveButtonToSuccess() {
    let saveButton = $('#saveBtn');
    saveButton.attr('class', 'btn btn-success');
<<<<<<< HEAD
    saveButton.text('Added!');
=======
    saveButton.html('Added!');
>>>>>>> development
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        setSaveButtonFunctionality();
    }, 3000);
<<<<<<< HEAD
}

function saveCurrentPageToBlacklist() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        let activeTab = arrayOfTabs[0];
        blockedSiteBuilder.createNewBlockedSite(activeTab.url, function (blockedSite) {
            synchronizer.addSiteAndSync(blockedSite, setSaveButtonToSuccess());
        });
    });
}

function setSaveButtonFunctionality() {
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
=======
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
>>>>>>> development
    });

}

connectButtons();

