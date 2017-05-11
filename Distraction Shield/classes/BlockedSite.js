import * as constants from '/Distraction Shield/constants';

/* --------------- --------------- Serialization --------------- --------------- */
//Private to this and storage.js
export function serializeBlockedSite (blockedSite) {
    let obj = {
        url: blockedSite.url,
        domain: blockedSite.domain,
        name: blockedSite.name,
        icon: blockedSite.icon,
        checkboxVal: blockedSite.checkboxVal,
        counter: blockedSite.counter,
        timeSpent: blockedSite.timeSpent
    };
    return JSON.stringify(obj);
}

//Private to this and blocked_site_list
export function parseBlockedSite (blockedSite) {
    let b = new BlockedSite();
    b.url = blockedSite.url;
    b.domain = blockedSite.domain;
    b.name = blockedSite.name;
    b.icon = blockedSite.icon;
    b.checkboxVal = blockedSite.checkboxVal;
    b.counter = blockedSite.counter;
    b.timeSpent = blockedSite.timeSpent;
    return b;
}

//Private to this and storage.js
export function deserializeBlockedSite (serializedBlockedSite) {
    if (serializedBlockedSite != null) {
        let parsed = JSON.parse(serializedBlockedSite);
        return parseBlockedSite(parsed);
    }
    return null;
}

/* --------------- --------------- --------------- --------------- --------------- */

export default class BlockedSite {

    constructor (urlBase, title) {
        this._url = this.constructUrl(urlBase);
        this._domain = urlBase;
        this._name = title;
        this._icon = this.constructIcon(urlBase);
        this._checkboxVal = true;
        this._counter = 0;
        this._timeSpent = 0;
    }

    constructUrl (url) {
        return "*://" + url + "/*";
    };

    constructIcon (url) {
        return "<img style=\"-webkit-user-select: none\" src=\"" + constants.FAVICONLINK + url + "\">"
    };

    set url         (url)           { this._url = url }
    get url         ()              { return this._url }

    set domain      (domain)        { this._domain = domain }
    get domain      ()              { return domain }

    set icon        (icon)          { this._icon = icon }
    get icon        ()              { return this._icon }

    set name        (name)          { this._name = name }
    get name        ()              { return this._name }

    set counter     (counter)       { this._counter = counter }
    get counter     ()              { return this._counter }

    set timeSpent   (timeSpent)     { this._timeSpent = timeSpent }
    get timeSpent   ()              { return this._timeSpent }

    set checkboxVal (checkboxVal)   { this._checkboxVal = checkboxVal }
    get checkboxVal ()              { return this._checkboxVal }

}