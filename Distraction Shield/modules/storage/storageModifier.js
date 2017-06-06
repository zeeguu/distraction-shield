import * as constants from '../../constants'
import {getBlacklistPromise, setBlacklist} from './storage'

/* ----------------  BlockedSiteList/Blacklist Modifications --------------- */

export function addBlockedSiteToStorage(blocked_site) {
    return getBlacklistPromise().then(blockedSiteList => {
        if (blockedSiteList.addToList(blocked_site)){
            return setBlacklist(blockedSiteList);
        } else
            return Promise.reject(constants.newUrlNotUniqueError + blocked_site.domain);
    });
}

export function removeBlockedSiteFromStorage(blocked_site) {
    return getBlacklistPromise().then(blockedSiteList => {
        blockedSiteList.removeFromList(blocked_site);
        return setBlacklist(blockedSiteList);
    });
}

export function updateBlockedSiteInStorage(blocked_site) {
    return getBlacklistPromise().then(blockedSiteList => {
        blockedSiteList.updateInList(blocked_site);
        return setBlacklist(blockedSiteList);
    });
}
