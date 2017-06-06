export default class StorageListener {
    constructor(handleStorageChange) {
        /**
         * Listener that makes sure that handleStorageChange is fired upon the sync.storage changing.
         */
        chrome.storage.onChanged.addListener(changes => {
            handleStorageChange(changes)
        });
    }
}