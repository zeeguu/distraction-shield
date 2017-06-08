import {getSettings, setSettings} from '../modules/storage/storage'

export function initDataCollectionModal(modalContainer, staticModal, callback) {
    modalContainer.unbind();
    if (staticModal)
        modalContainer.modal({
            backdrop: 'static',
            keyboard: false
        });
    modalContainer.modal('show');
    modalContainer.on('shown.bs.modal', () => {
        modalContainer.find('.modal-content').load("../introTour/dataCollectionFrame.html", initDataConsentButtons)
    });
    modalContainer.on('hidden.bs.modal', callback);
}

function initDataConsentButtons(){
    getSettings(settings_object => {
        let allowBox = $("#allowBox");
        allowBox.prop('checked', settings_object.collectData);
        allowBox.change(() => {
            setDataCollection($('#allowBox').is(':checked'));
        });
    })

}

function setDataCollection(bool){
    getSettings(settings_object => {
        settings_object.collectData = bool;
        setSettings(settings_object);
    })
}

