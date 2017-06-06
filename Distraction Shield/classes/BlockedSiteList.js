import BlockedSite from '../classes/BlockedSite'

/**
 * List that holds BlockedSite Objects and has functionality which is regularly needed on this array
 */
export default class BlockedSiteList extends Array {

    constructor() {
        super();
        this.__proto__ = BlockedSiteList.prototype;
    }

    get urls() {
        if (this != []) {
            return this.map(function (bs) {
                return bs.url;
            });
        }
        return [];
    }

    get activeUrls() {
        if (this != []) {
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
            this.push(newBlockedSite);
            return true;
        } else {
            return false;
        }
    }

    addAllToList(blockedSiteList) {
        for (let i = 0; i < blockedSiteList.length; i++) {
            this.addToList(blockedSiteList[i]);
        }
    }

    removeFromList(blockedSiteToDelete) {
        this.slice(0, this.indexOf(blockedSiteToDelete)).concat(this.slice(this.indexOf(blockedSiteToDelete) + 1, this.length));
    }

    updateInList(blockedSite){
        this.forEach((item, id) => {
            if (item.url === blockedSite.url)
                this[id] = blockedSite;
        });
    }

    filterOnChecked() {
        if (this != []) {
            return this.filter(function (a) {
                return a.checkboxVal == true;
            });
        }
        return [];
    }

    /* --------------- --------------- Serialization --------------- --------------- */

    static serializeBlockedSiteList(blockedSiteList) {
        let toSerialize = blockedSiteList.map(BlockedSite.serializeBlockedSite);
        return JSON.stringify(toSerialize);
    }

    static parseBlockedSiteList(blockedSiteList) {
        let bl = new BlockedSiteList();
        bl.addAllToList(blockedSiteList);
        return bl;
    }

    static deserializeBlockedSiteList(serializedBlockedSiteList) {
        if (serializedBlockedSiteList != null) {
            let parsed = JSON.parse(serializedBlockedSiteList);
            parsed = parsed.map(BlockedSite.deserializeBlockedSite);
            return BlockedSiteList.parseBlockedSiteList(parsed);
        }
        return null;
    }

}