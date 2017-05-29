import * as storage from '../modules/storage';
import BlockedSiteList from '../classes/BlockedSiteList';
import UserSettings from '../classes/UserSettings';


export function syncBlacklist(blockedSiteList) {
    storage.setBlacklist(blockedSiteList);
    chrome.runtime.sendMessage({
        message: "updateListener",
        siteList: BlockedSiteList.serializeBlockedSiteList(blockedSiteList)
    });
}

export function syncSettings(settings) {
    storage.setSettings(settings);
    chrome.runtime.sendMessage({
        message: "updateSettings",
        settings: UserSettings.serializeSettings(settings)
    });
    console.log('message sent');
}

export function addSiteAndSync(blockedSiteItem, callback) {
    storage.getBlacklist(function (blacklist) {
        if (blacklist.addToList(blockedSiteItem)) {
            syncBlacklist(blacklist);
            callback();
        }
    });

}