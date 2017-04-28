define (['constants', 'BlockedSite'], function BlockedSiteList(constants, BlockedSite) {
    /* --------------- --------------- Serialization --------------- --------------- */

    //Private to this and storage.js
    serializeBlockedSiteList = function (blockedSiteList) {
        var obj = {
            list: blockedSiteList.getList()
        };
        obj.list.map(BlockedSite.serializeBlockedSite);
        return JSON.stringify(obj);
    };

    //Private method
    parseBlockedSiteList = function (blockedSiteList) {
        var bl = new BlockedSiteList();
        bl.setList(blockedSiteList.list);
        return bl;
    };

    //Private to this and storage.js
    deserializeBlockedSiteList = function (serializedBlockedSiteList) {
        if (serializedBlockedSiteList != null) {
            var parsed = JSON.parse(serializedBlockedSiteList);
            //TODO check if this works
            parsed.list = parsed.list.map(BlockedSite.parseBlockedSite);
            return parseBlockedSiteList(parsed);
        }
        return null;
    };

    /* --------------- --------------- --------------- --------------- --------------- */

    function BlockedSiteList () {
        var list = [];

        this.setList = function (blockedSiteArr) {
            list = blockedSiteArr;
        };
        this.getList = function () {
            return list;
        };

        this.addToList = function (newBlockedSite) {
            var currentUrls = this.getUrls();
            console.log('currentUrls : ' + (currentUrls == null ? "null" : "not null")); //todo remove
            console.log('newBlockedSite : ' + (newBlockedSite== null ? "null" : "not null")); //todo remove
            var unique = currentUrls.every(function (urlFromList) {
                return urlFromList != newBlockedSite.getUrl();
            });
            if (unique) {
                list.push(newBlockedSite);
                return true;
            } else {
                alert(constants.newUrlNotUniqueError + newBlockedSite.getDomain());
                return false;
            }
        };

        this.addAllToList = function (blockedSiteList) {
            for (var i = 0; i < blockedSiteList.getList().length; i++) {
                this.addToList(blockedSiteList.getList()[i]);
            }
        };

        this.removeFromList = function (blockedSiteToDelete) {
            var urlKey = list.indexOf(blockedSiteToDelete);
            if (urlKey > -1) {
                list.splice(urlKey, 1);
                return true;
            } else {
                return false;
            }
        };

        this.filterOnChecked = function () {
            if (list != []) {
                return list.filter(function (a) {
                    return a.checkboxVal == true;
                });
            }
            return [];
        };

        this.getUrls = function () {
            if (list != []) {
                return list.map(function (a) {
                    return a.url;
                });
            }
            return [];
        };

        this.getActiveUrls = function () {
            if (list != []) {
                var urlList = this.filterOnChecked();
                if (urlList != []) {
                    return urlList.map(function (a) {
                        return a.url;
                    });
                }
            }
            return [];
        };
    }



    return {
        BlockedSiteList : BlockedSiteList,
        serializeBlockedSiteList : serializeBlockedSiteList,
        deserializeBlockedSiteList : deserializeBlockedSiteList
    }
});

