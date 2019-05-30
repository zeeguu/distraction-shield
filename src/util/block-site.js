/* global chrome */
import Autolinker from 'autolinker';
import * as UrlParser from 'url-parse';
import { message } from 'antd';

export function getWebsites() {
    return new Promise((resolve, reject) => {
        // get blocked websites
        if (!(chrome && chrome.storage)) resolve([]); // not inside chrome environment.

        chrome.storage.sync.get(['blockedUrls'], (result) => {
            let blockedUrls = result.blockedUrls || [];
            resolve(blockedUrls);
        });
    });
}

export function setWebsites(blockedUrls) {
    return new Promise((resolve, reject) => {
        if (!(chrome && chrome.storage)) resolve(); // not inside chrome environment.

        chrome.storage.sync.set({ blockedUrls }, resolve);
    });
}

export const blockCurrentWebsite = () => {
    if (!(chrome && chrome.tabs)) return; // no chrome env.
  
    chrome.tabs.getSelected(null, function(tab) {
      blockWebsite(tab.url);
    });
}
  
export const blockWebsite = (url) => {
    let matches = Autolinker.parse(url, {
      urls: true,
      email: true
    });
  
    if (!matches.length) return message.error('No valid link.');
  
    let urls = matches.map(urlToParser);
  
    getWebsites().then(blockedUrls => {
        let notBlocked = url => {
            return !blockedUrls.find(blocked => blocked.regex === url.regex);
        };
        let regexed = urls.map(mapToBlockedUrl);
        let blocked = [];
        regexed.forEach(item => {
            if (notBlocked(item)) {
                blockedUrls.push(item)
                blocked.push(item);
            };
        });
        
        return setWebsites(blockedUrls).then(() => {
            if (blocked.length > 1) {
                message.success(`Blocked ${blocked.length} websites`); 
            } else {
                message.success(`Blocked ${blocked[0].hostname}`);
            }
        });
    });
}

export const unblockWebsite = (hostname) => {
    getWebsites().then(blockedUrls => {
        let newBlockedUrls = blockedUrls.filter(blockedUrl => 
            blockedUrl.hostname !== hostname);

        return setWebsites(newBlockedUrls);
    }).then(() => message.success(`Unblocked ${hostname}`));
};

export const storageChange = callback => {
    if (!(chrome && chrome.storage)) return;

    chrome.storage.onChanged.addListener(callback);
};


// utility functions
function urlToParser(match) {
  let url = match.getUrl();
  let parser = new UrlParser(url);
  return parser;
}

function mapToBlockedUrl(parser) {
  let regex = `*://*.${parser.hostname}/*`;
  let { hostname, href, pathname } = parser;

  return {
    hostname,
    href,
    pathname,
    regex
  };
}