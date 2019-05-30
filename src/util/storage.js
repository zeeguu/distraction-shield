/* global chrome */
let listeners = [];

export function getFromStorage(...keys) {
    return new Promise(resolve => {
        if (chrome && chrome.storage) {
            chrome.storage.sync.get(keys, result => {
                resolve(result);
            });
        } else {
            let result = keys.reduce((acc, val) => {
                acc[val] = JSON.parse(localStorage.getItem(val));
                return acc;
            }, {});

            resolve(result);
        }
    });
}

export function setInStorage(items) {
    return new Promise(resolve => {
        if (chrome && chrome.storage) {
            chrome.storage.sync.set(items, () => {
                resolve();
            });
        } else {
            Object.keys(items).forEach(key => {
                localStorage.setItem(key, JSON.stringify(items[key]));
            });
            listeners.forEach(callback => callback());

            resolve();
        }
    });
}

export const addStorageListener = callback => {
    if (!(chrome && chrome.storage)) {
        listeners.push(callback);
        window.addEventListener('storage', callback); // only for external tab
    } else {
        chrome.storage.onChanged.addListener(callback);
    }
};