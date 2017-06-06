import {getSettings, setSettings} from '../modules/storage/storage'

export function initDataCollectionModal(modalContainer) {
    modalContainer.unbind();
    modalContainer.on('shown.bs.modal', function () {
        modalContainer.find('.modal-content').load("../introTour/dataCollectionFrame.html");
        //TODO figure out why this is needed for introtour.
        setTimeout(initDataConsentButtons, 200);
    })
}

function initDataConsentButtons(){
    let allow = $('#allowButton');
    let deny = $('#denyButton')
    allow.unbind();
    deny.unbind();
    allow.on('click', () => { setDataCollection(true)});
    deny.on('click', () => { setDataCollection(false)});
}

function setDataCollection(bool){
    getSettings(settings_object => {
        settings_object.collectData = bool;
        setSettings(settings_object);
    })
}

