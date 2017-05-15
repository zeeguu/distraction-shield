import * as constants from '../constants'
import * as storage from '../modules/storage'

    function mainFlow() {
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
                let infoDiv = $.parseHTML(data);
                $("body").after(infoDiv);
                $("#tds_infoDiv").css('max-width', '800px');
                $("#tds_generalInfoText").append(constants.zeeguuInfoText);
                $("#tds_modeSpecificText").append(message);
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