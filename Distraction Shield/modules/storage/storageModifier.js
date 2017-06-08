import * as constants from '../../constants'
import {getBlacklistPromise, setBlacklist} from './storage'
import {logToFile} from '../../modules/logger'

/**
 * @module This module is used for changing stuff inside the storage. This is used for getting, updating and setting
 * data that is supposed to be in the storage.
 */


/* ----------------  BlockedSiteList/Blacklist Modifications --------------- */

export function addBlockedSiteToStorage(blocked_site) {
    return getBlacklistPromise().then(blockedSiteList => {
        if (blockedSiteList.addToList(blocked_site)){
            logToFile(`added`, blocked_site.name,'', 'settings');
            return setBlacklist(blockedSiteList);
        } else
            return Promise.reject(constants.newUrlNotUniqueError + blocked_site.domain);
    });
}

export function removeBlockedSiteFromStorage(blocked_site) {
    return getBlacklistPromise().then(blockedSiteList => {
        blockedSiteList.removeFromList(blocked_site);
        logToFile(`removed`, blocked_site.name, '', 'settings');
        return setBlacklist(blockedSiteList);
    });
}

export function updateBlockedSiteInStorage(blocked_site) {
    return getBlacklistPromise().then(blockedSiteList => {
        blockedSiteList.updateInList(blocked_site);
        return setBlacklist(blockedSiteList);
    });
}
