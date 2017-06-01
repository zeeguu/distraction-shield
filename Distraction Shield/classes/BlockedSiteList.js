import * as constants from '../constants';
import BlockedSite from '../classes/BlockedSite'

/**
 * List that holds BlockedSite Objects and has functionality which is regularly needed on this array
 */
export default class BlockedSiteList {

    constructor() {
        this._list = [];
    }

    set list(blockedSiteArr) {
        this._list = blockedSiteArr
    }

    get list() {
        return this._list
    }

    get urls() {
        if (this.list != []) {
            return this.list.map(function (bs) {
                return bs.url;
            });
        }
        return [];
    }

    get activeUrls() {
        if (this.list != []) {
            let urlList = this.filterOnChecked();
            if (urlList != []) {
                return urlList.map(function (bs) {
                    return bs.url;
                });
            }
        }
        return [];
    }

    addToList(newBlockedSite) {
        let currentUrls = this.urls;
        let unique = currentUrls.every(function (urlFromList) {
            return urlFromList != newBlockedSite.url;
        });
        if (unique) {
            this.list.push(newBlockedSite);
            return true;
        } else {
            alert(constants.newUrlNotUniqueError + newBlockedSite.domain);
            return false;
        }
    }

    addAllToList(blockedSiteList) {
        for (let i = 0; i < blockedSiteList.list.length; i++) {
            this.addToList(blockedSiteList.list[i]);
        }
    }

    removeFromList(blockedSiteToDelete) {
        let currentUrls = this.urls;
        this.list = this.list.filter(item => item.url != blockedSiteToDelete.url);

        // let urlKey = this.list.indexOf(blockedSiteToDelete);
        // if (urlKey > -1) {
        //     this.list.splice(urlKey, 1);
        //     return true;
        // } else {
        //     return false;
        // }
    }

    updateInList(blockedSite){
        //TODO FIXIE, can't find element in array
        let urlKey = this.list.indexOf(blockedSite);
        chrome.extension.getBackgroundPage().console.log(blockedSite);
        let unique = this.list.every(function (urlFromList) {
            return urlFromList != blockedSite;
        });
        chrome.extension.getBackgroundPage().console.log(unique);

        if (urlKey > -1) {
            this.list[urlKey] = blockedSite;
            return true;
        } else {
            return false;
        }
    }

    filterOnChecked() {
        if (this.list != []) {
            return this.list.filter(function (a) {
                return a.checkboxVal == true;
            });
        }
        return [];
    }

    /* --------------- --------------- Serialization --------------- --------------- */

    static serializeBlockedSiteList(blockedSiteList) {
        let obj = {
            list: blockedSiteList.list
        };
        obj.list = obj.list.map(BlockedSite.serializeBlockedSite);
        return JSON.stringify(obj);
    }

    static parseBlockedSiteList(blockedSiteList) {
        let bl = new BlockedSiteList();
        bl.list = blockedSiteList.list;
        return bl;
    }

    static deserializeBlockedSiteList(serializedBlockedSiteList) {
        if (serializedBlockedSiteList != null) {
            let parsed = JSON.parse(serializedBlockedSiteList);
            parsed.list = parsed.list.map(BlockedSite.deserializeBlockedSite);
            return this.parseBlockedSiteList(parsed);
        }
        return null;
    }

}

