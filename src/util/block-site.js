/* global chrome */
import { message } from 'antd';
import Autolinker from 'autolinker';
import UrlParser from 'url-parse';
import { getFromStorage, setInStorage } from './storage';

export function getWebsites() {
    return getFromStorage('blockedUrls').then(res => res.blockedUrls || []);
}

export const blockCurrentWebsite = () => {
    if (!(window.chrome && chrome.tabs)) return; // no chrome env.

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        blockWebsite(tab.url).then(() => {
            chrome.tabs.reload(tab.id);
        });
    });
}

export const unBlockCurrentWebsite = () => {
    if (!(window.chrome && chrome.tabs)) return; // no chrome env.

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        let hostname = new UrlParser(tab.url).hostname;
        unblockWebsite(hostname);
    });
}

export const isCurrentWebsiteBlocked = () => {
    return new Promise((resolve) => {
        if (!(window.chrome && chrome.tabs)) return resolve(false); // no chrome env.

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let tab = tabs[0];
            let hostname = new UrlParser(tab.url).hostname;
            isWebsiteBlocked(hostname).then(resolve);
        });
    });
};

export const isWebsiteBlocked = hostname => {
    return getWebsites().then(blockedUrls => {
        // sidenote: shouldn't we compare regex? let hostname be OK for now..
        return blockedUrls.find(blocked => blocked.hostname === hostname);
    });
};

export const blockWebsite = url => {
    let urls = autoLink(url).map(urlToParser).map(mapToBlockedUrl);
    if (!urls.length) return message.error('No valid link.');

    return getWebsites().then(blockedUrls => {
        let notBlocked = url => {
            return !blockedUrls.find(blocked => blocked.regex === url.regex);
        };
        let blocked = urls.filter(notBlocked);
        blockedUrls.push(...blocked);

        return setInStorage({ blockedUrls }).then(() => {
            if (blocked.length > 1) {
                message.success(`Blocked ${blocked.length} websites`);
            } else if (blocked.length === 1) {
                message.success(`Blocked ${blocked[0].hostname}`);
            } else {
                message.success(`${url} is blocked.`);
            }
        });
    });
}

export const unblockWebsite = (hostname) => {
    getWebsites().then(oldBlockedUrls => {
        let blockedUrls = oldBlockedUrls.filter(blockedUrl =>
            blockedUrl.hostname !== hostname);

        return setInStorage({ blockedUrls });
    }).then(() => message.success(`Unblocked ${hostname}`));
};

// utility functions
export const autoLink = url => {
    let matches = Autolinker.parse(url, {
        urls: true,
        email: false,
        phone: false
    });
    return matches;
}

export const urlToParser = (match) => {
    let url = match.getUrl();
    let parser = new UrlParser(url);
    return parser;
}

export const mapToBlockedUrl = (parser) => {
    let regex = `*://*.${parser.hostname}/*`;
    let { hostname, href, pathname } = parser;

    return {
        hostname,
        href,
        pathname,
        regex
    };
}