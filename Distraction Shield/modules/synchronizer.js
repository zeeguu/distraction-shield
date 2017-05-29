import * as storage from '../modules/storage';
import BlockedSiteList from '../classes/BlockedSiteList';
import UserSettings from '../classes/UserSettings';

/**
 * takes a blockedSiteList from some third-party page and syncs this with the background and the storage
 * @param {blockedSiteList} blockedSiteList the list to be synched
 */
export function syncBlacklist(blockedSiteList) {
    storage.setBlacklist(blockedSiteList);
    chrome.runtime.sendMessage({
        message: "updateListener",
        siteList: BlockedSiteList.serializeBlockedSiteList(blockedSiteList)
    });
}

/**
 * takes a UserSettings object from some third-party page and syncs this with the background and the storage
 * @param {UserSettings} settings the object to be synched
 */
export function syncSettings(settings) {
    storage.setSettings(settings);
    chrome.runtime.sendMessage({
        message: "updateSettings",
        settings: UserSettings.serializeSettings(settings)
    });
}

/**
 * takes a BlockedSite Object and tries to add this to the BlockedSiteList in storage, then on success calls the callback
 * @param {BlockedSite} blockedSiteItem the object to be added to the BlockedSiteList in storage.
 * @param {function} callback function callback to be executed if adding succeeds
 */
export function addSiteAndSync(blockedSiteItem, callback) {
    storage.getBlacklist(function (blacklist) {
        if (blacklist.addToList(blockedSiteItem)) {
            syncBlacklist(blacklist);
            callback();
        }
    });

}