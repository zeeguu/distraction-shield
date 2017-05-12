import * as constants from '../constants';
import * as BlockedSite from '../classes/BlockedSite'

/* --------------- --------------- --------------- --------------- --------------- */

export class BlockedSiteList {
    constructor () {
        this._list = [];
    }


    set list (blockedSiteArr)   { this._list = blockedSiteArr }
    get list ()                 { return this._list }

    get urls () {
        if (this.list != []) {
            return _list.map(function (bs) {
                return bs.url;
            });
        }
        return [];
    }

    get activeUrls () {
        if (this.list != []) {
            let urlList = this.filterOnChecked();
            if (urlList !== []) {
                return urlList.map(function (bs) {
                    return bs.url;
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
            _list.push(newBlockedSite);
            return true;
        } else {
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
        let urlKey = _list.indexOf(blockedSiteToDelete);
        if (urlKey > -1) {
            _list.splice(urlKey, 1);
            return true;
        } else {
            return false;
        }
    };

    filterOnChecked () {
        if (this.list != []) {
            return _list.filter(function (a) {
                return a.checkboxVal == true;
            });
        }
        return [];
    };

    /* --------------- --------------- Serialization --------------- --------------- */
    
    static serializeBlockedSiteList (blockedSiteList) {
        let obj = {
            list: blockedSiteList.list
        };
        obj.list = obj.list.map(BlockedSite.serializeBlockedSite);
        return JSON.stringify(obj);
    }

    static parseBlockedSiteList (blockedSiteList) {
        let bl = new BlockedSiteList();
        bl.setList(blockedSiteList.list);
        return bl;
    }

    static deserializeBlockedSiteList(serializedBlockedSiteList) {
        if (serializedBlockedSiteList != null) {
            let parsed = JSON.parse(serializedBlockedSiteList);
            parsed.list = parsed.list.map(BlockedSite.deserializeBlockedSite);
            return parseBlockedSiteList(parsed);
        }
        return null;
    }
    
}

