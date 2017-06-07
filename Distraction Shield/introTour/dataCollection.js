import {getSettings, setSettings} from '../modules/storage/storage'

export function initDataCollectionModal(modalContainer) {
    modalContainer.unbind();
    modalContainer.on('shown.bs.modal', function () {
        modalContainer.find('.modal-content').load("../introTour/dataCollectionFrame.html");
        getSettings(settings_object => {
            initDataConsentButtons(settings_object.collectData);
        })
        //TODO figure out why this is needed for introtour.
    })
}

function initDataConsentButtons(bool){
    chrome.extension.getBackgroundPage().console.log(allowbox, bool);
    $("#allowBox").change(function () {
        setDataCollection($('#allowBox').is(':checked'));
    });
}

function setDataCollection(bool){
    getSettings(settings_object => {
        settings_object.collectData = bool
        chrome.extension.getBackgroundPage().console.log(bool);
        setSettings(settings_object);
    })
}

