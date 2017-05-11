import BlockedSite from './BlockedSite';
import * as constants from '/Distraction Shield/constants';

/* --------------- --------------- Serialization --------------- --------------- */

//Private to this and storage.js
export function serializeBlockedSiteList (blockedSiteList) {
    let obj = {
        list: blockedSiteList.getList()
    };
    obj.list = obj.list.map(BlockedSite.serializeBlockedSite);
    return JSON.stringify(obj);
}
//Private method
export function parseBlockedSiteList (blockedSiteList) {
    let bl = new BlockedSiteList();
    bl.setList(blockedSiteList.list);
    return bl;
}
//Private to this and storage.js
export function deserializeBlockedSiteList(serializedBlockedSiteList) {
    if (serializedBlockedSiteList != null) {
        let parsed = JSON.parse(serializedBlockedSiteList);
        parsed.list = parsed.list.map(BlockedSite.deserializeBlockedSite);
        return parseBlockedSiteList(parsed);
    }
    return null;
}
/* --------------- --------------- --------------- --------------- --------------- */

export class BlockedSiteList {
    constructor () {
        this._list = [];
    }


    set list (blockedSiteArr)   { this._list = blockedSiteArr }
    get list ()                 { return this._list }

    get urls () {
        if (list != []) {
            return list.map(function (bs) {
                return bs.url();
            });
        }
        return [];
    }

    get activeUrls () {
        if (list != []) {
            let urlList = this.filterOnChecked();
            if (urlList != []) {
                return urlList.map(function (bs) {
                    return bs.url();
                });
            }
        }
        return [];
    }

    addToList (newBlockedSite) {
        let currentUrls = this.urls;
        let unique = currentUrls.every(function (urlFromList) {
            return urlFromList !== newBlockedSite.url;
        });
        if (unique) {
            list.push(newBlockedSite);
            return true;
        } else {   //TODO "newUrlNotUniqueError"  is not recognized?
            alert( constants.newUrlNotUniqueError + newBlockedSite.domain);
            return false;
        }
    };

    addAllToList (blockedSiteList) {
        for (let i = 0; i < blockedSiteList.list.length; i++) {
            this.addToList(blockedSiteList.list[i]);
        }
    };

    removeFromList (blockedSiteToDelete) {
        let urlKey = list.indexOf(blockedSiteToDelete);
        if (urlKey > -1) {
            list.splice(urlKey, 1);
            return true;
        } else {
            return false;
        }
    };

    filterOnChecked () {
        if (list != []) {
            return list.filter(function (a) {
                return a.getCheckboxVal() == true;
            });
        }
        return [];
    };

}

