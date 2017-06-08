/**
 * simple module that adds a listener which listens for changes in the storage.
 * Page that use data from the storage and need to be updated on change, will implement a function that defines what to
 * do with the changes and pass it on to the constructor of this class. This method will then fire upon the change of storage.
 * @module StorageListener
 */

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