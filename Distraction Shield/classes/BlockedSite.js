import * as constants from '/constants';

/* --------------- --------------- Serialization --------------- --------------- */
//Private to this and storage.js
export function serializeBlockedSite (blockedSite) {
    var obj = {
        url: blockedSite.getUrl(),
        domain: blockedSite.getDomain(),
        name: blockedSite.getName(),
        icon: blockedSite.getIcon(),
        checkboxVal: blockedSite.getCheckboxVal(),
        counter: blockedSite.getCounter(),
        timeSpent: blockedSite.getTimeSpent()
    };
    return JSON.stringify(obj);
};

//Private to this and blocked_site_list
export function parseBlockedSite (blockedSite) {
    var b = new BlockedSite();
    b.setUrl(blockedSite.url);
    b.setDomain(blockedSite.domain);
    b.setName(blockedSite.name);
    b.setIcon(blockedSite.icon);
    b.setCheckboxVal(blockedSite.checkboxVal);
    b.setCounter(blockedSite.counter);
    b.setTimeSpent(blockedSite.timeSpent);
    return b;
};

//Private to this and storage.js
export function deserializeBlockedSite (serializedBlockedSite) {
    if (serializedBlockedSite != null) {
        var parsed = JSON.parse(serializedBlockedSite);
        return parseBlockedSite(parsed);
    }
    return null;
};

/* --------------- --------------- --------------- --------------- --------------- */

export class BlockedSite {

    constructor (urlBase, title) {
        this._url = this.constructUrl(urlBase);
        this._domain = urlBase;
        this._name = title;
        this._icon = constructIcon(urlBase);
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

    set url     (newUrl)    { this._url = newUrl }
    get url     ()          { return this._url }

    set domain  (newDomain) { this._domain = newDomain }
    get domain  ()          { return domain }

    set icon    (newIcon)   { this._icon = newIcon }
    get icon    ()          { return this._icon }

    set name    (newName)   { this._name = newName }
    get name    ()          { return this._name }

    set counter (newVal) { this._counter = newVal }
    get counter () { return this._counter }

    set timeSpent (newVal) { this._timeSpent = newVal }
    get timeSpent () { return this._timeSpent }

    set checkboxVal (newVal) { this._checkboxVal = newVal }
    get checkboxVal () { return this._checkboxVal }

}