import * as storage from '../modules/storage';
import UserSettings from '../classes/UserSettings';

/**
 * takes a UserSettings object from some third-party page and syncs this with the background and the storage
 * @param {UserSettings} settings the object to be synched
 */
export function syncSettings(settings) {
    storage.setSettings(settings);
    chrome.runtime.sendMessage({
        message: "updateSettings",
        settings: UserSettings.serializeSettings(settings)
    });
}
