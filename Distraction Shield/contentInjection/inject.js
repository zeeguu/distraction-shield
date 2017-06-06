import * as constants from '../constants'
import * as storage from '../modules/storage'

/**
 * Check if we have come here after tds redirection, if not return, if so get mode and
 */
function mainFlow() {
    if (!constants.tdsRedirectParam.test(window.location.href)) return;
    storage.getMode(initBasis);
}

/**
 * Initialize the tds info panel with the proper text based on mode
 * @param {JSON object} mode
 */
function initBasis(mode) {
    let message = mode.zeeguuText;
    $.ajax({
        url: chrome.extension.getURL('contentInjection/inject.html'),
        type: "GET",
        timeout: 5000,
        datatype: "html",
        success: function (data) {
            let infoDiv = $.parseHTML(data);
            $("body").after(infoDiv);
            $("#tds_infoDiv").css('max-width', '800px');
            $("#tds_generalInfoText").append(constants.zeeguuInfoText);

            if (window.location.href.indexOf(constants.zeeguLoginLink) != -1) {
                if (mode.label == constants.modes.pro.label) {
                    message = constants.loginMessage;
                } else {
                    message = message +"\n" + constants.loginMessage;
                }
            }
            $("#tds_modeSpecificText").append(message);

            $("#originalDestination").attr("href", extractDestination());
        }
    });
}

/**
 * This function extracts the original destination from a get parameter in the current url
 * @returns {String} newUrl The url of the original destination plus a
 * get parameter indicating that the zeeguu exercise was completed. Should never return null!
 */
function extractDestination() {
    let url = window.location.href;
    let results = constants.tdsRedirectParam.exec(url);
    if (!results || !results[1]) { return null; }
    let newUrl = results[1];
    newUrl += (/[?]/.test(newUrl) ? "&" : "?") + "tds_exComplete=true";
    return newUrl;
}

mainFlow();