import * as constants from '../constants'
import * as storage from '../modules/storage'

function mainFlow() {
    console.log("@:" + window.location.href);//todo remove

    if (window.location.href.indexOf("from_tds=true") == -1) return;

    storage.getMode(initBasis);
}

function initBasis(mode) {
    let message = mode.zeeguuText;


    $.ajax({
        url: chrome.extension.getURL('contentInjection/inject.html'),
        type: "GET",
        timeout: 5000,
        datatype: "html",
        success: function (data) {
<<<<<<< HEAD
            let infoDiv = $.parseHTML(data);
            $("body").after(infoDiv);
            $("#tds_infoDiv").css('max-width', '800px');
            $("#tds_generalInfoText").append(constants.zeeguuInfoText);

            let putModeText = true;
            if ((window.location.href == constants.zeeguLoginLink) && (mode.label != constants.modes.lazy.label)) {
                putModeText = false;
            }
            if (putModeText) $("#tds_modeSpecificText").append(message);

=======
            infoDiv = $.parseHTML(data);
            $("body").after(infoDiv);
            $("#tds_infoDiv").css('max-width', '800px');
            $("#tds_generalInfoText").append(zeeguuInfoText);
            $("#tds_modeSpecificText").append(message);
>>>>>>> development
            $("#originalDestination").attr("href", getDest());
        }
    });
}

function getDest() {
    let url = window.location.href;
    let regex = new RegExp("[?&]redirect(=([^&#]*)|&|#|$)");
    let results = regex.exec(url);
    if (!results || !results[2]) {
        return null;
    }
    let newUrl = decodeURIComponent(results[2].replace(/\+/g, " "));
    if (newUrl.indexOf("?") > -1) {
        newUrl += "&tds_exComplete=true";
    } else {
        newUrl += "?tds_exComplete=true";
    }
    return newUrl;
}

mainFlow();