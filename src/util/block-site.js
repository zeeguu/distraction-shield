/* global chrome */
import { message } from 'antd';
import Autolinker from 'autolinker';
import UrlParser from 'url-parse';
import parseDomain from 'parse-domain';
import { getFromStorage, setInStorage } from './storage';
import { defaultExerciseSites } from './constants';

export async function getWebsites() {
    const res = await getFromStorage('blockedUrls');
    return res.blockedUrls || [];
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

export const isWebsiteBlocked = async hostname => {
    const blockedUrls = await getWebsites();
    // sidenote: shouldn't we compare regex? let hostname be OK for now..
    return blockedUrls.find(blocked => blocked.hostname === hostname);
};

export const blockWebsite = async text => {
    let urls = parseUrls(text);
    if (!urls.length) return message.error('No valid link.');

    const blockedUrls = await getWebsites();
    
    let notBlocked = url => {
        return !blockedUrls.find(blocked => blocked.regex === url.regex);
    };
    let blocked = urls.filter(notBlocked);
    blockedUrls.push(...blocked);

    await setInStorage({ blockedUrls });

    if (blocked.length > 1) {
        message.success(`Blocked ${blocked.length} websites`);
    }
    else if (blocked.length === 1) {
        message.success(`Blocked ${blocked[0].hostname}`);
    }
    else {
        message.success(`${urls[0].hostname} is already blocked.`);
    }
}

export const addExerciseSite = async text => {
    let urls = parseUrls(text);
    if (!urls.length) return message.error('No valid link.');

    const res = await getFromStorage('exerciseSites');
    const exerciseSites = res.exerciseSites || defaultExerciseSites;

    urls.forEach(url => {
        let alreadyIn = exerciseSites.find(site => site.domain === url.domain);
        if (!alreadyIn) exerciseSites.push(url);
    })

    await setInStorage({ exerciseSites });

    message.success(`Added exercise site!`); // @TODO make messages like in blockWebsite()
}

export const unblockWebsite = (hostname) => {
    getWebsites().then(oldBlockedUrls => {
        let blockedUrls = oldBlockedUrls.filter(blockedUrl =>
            blockedUrl.hostname !== hostname);

        return setInStorage({ blockedUrls });
    }).then(() => message.success(`Unblocked ${hostname}`));
};

// utility functions
export const parseUrls = text => {
    return autoLink(text)
        .map(urlToParser)
        .map(mapToBlockedUrl)
        .map(parseDomainFromUrl);
}

export const parseUrl = text => parseUrls(text)[0];

const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const parseDomainFromUrl = urlObject => {
    let parsed = parseDomain(urlObject.href);
    return {
        ...urlObject,
        ...parsed, // attaches subdomain, domain, tld
        name: capitalize(parsed.domain)
    }
}

const autoLink = url => {
    let matches = Autolinker.parse(url, {
        urls: true,
        email: false,
        phone: false
    });
    return matches;
}

const urlToParser = (match) => {
    let url = match.getUrl();
    let parser = new UrlParser(url);
    return parser;
}

const mapToBlockedUrl = (parser) => {
    let regex = `*://*.${parser.hostname}/*`;
    let { hostname, href, pathname } = parser;

    return {
        hostname,
        href,
        pathname,
        regex
    };
}