define(['constants'], function BlockedSite(constants) {

    /* --------------- --------------- Serialization --------------- --------------- */
    //Private to this and storage.js
    serializeBlockedSite = function (blockedSite) {
        return JSON.stringify(blockedSite);
    };

    //Private to this and blocked_site_list
    parseBlockedSite = function (blockedSite) {
        var b = new BlockedSite();
        b.setUrl(blockedSite.getUrl());
        b.setName(blockedSite.getName());
        b.setIcon(blockedSite.getIcon());
        b.setCheckboxVal(blockedSite.getCheckboxVal());
        b.setCounter(blockedSite.getCounter());
        return b;
    };

    //Private to this and storage.js
    deserializeBlockedSite = function (serializedBlockedSite) {
        if (serializedBlockedSite != null) {
            var parsed = JSON.parse(serializedBlockedSite);
            return parseBlockedSite(parsed);
        }
        return null;
    };

    /* --------------- --------------- --------------- --------------- --------------- */

    function BlockedSite(url, title) {
        constructUrl = function (url) {
            return "*://" + url + "/*";
        };

        constructIcon = function (url) {
            return "<img style=\"-webkit-user-select: none\" src=\"" + constants.FAVICONLINK + url + "\">"
        };

        var url = this.constructUrl(url);
        var domain = url;
        var name = title;
        var icon = this.constructIcon(url);
        var checkboxVal = true;
        var counter = 0;

        this.getUrl = function () {
            return url;
        };
        this.setUrl = function (newUrl) {
            url = newUrl;
        };
        this.getDomain = function () {
            return domain;
        };
        this.setDomain = function (newDomain) {
            domain = newDomain;
        };
        this.getIcon = function () {
            return icon;
        };
        this.setIcon = function (newIcon) {
            icon = newIcon;
        };
        this.getName = function () {
            return name;
        };
        this.setName = function (newName) {
            name = newName;
        };
        this.getCounter = function () {
            return counter;
        };
        this.setCounter = function (newVal) {
            counter = newVal;
        };
        this.getCheckboxVal = function () {
            return checkboxVal;
        };
        this.setCheckboxVal = function (newVal) {
            checkboxVal = newVal;
        };

    }

    return {
        BlockedSite : BlockedSite,
        serializeBlockedSite : serializeBlockedSite,
        deserializeBlockedSite : deserializeBlockedSite
    }

});

