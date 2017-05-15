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
    console.log('smts');
    storage.setSettings(settings);
    chrome.runtime.sendMessage({
        message: "updateSettings",
        settings: UserSettings.serializeSettings(settings)
    });
}

export function addSiteAndSync(blockedSiteItem) {
    storage.getBlacklist(function (blacklist) {
        if (blacklist.addToList(blockedSiteItem)) {
            syncBlacklist(blacklist);
            return true;
        } else {
            return false;
        }
    });

}