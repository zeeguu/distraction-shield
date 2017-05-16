
mainFlow = function() {
    storage.getMode(initBasis);
};

initBasis = function(mode) {
    var message = mode.zeeguuText;

    $.ajax({
        url: chrome.extension.getURL('contentInjection/inject.html'),
        type: "GET",
        timeout: 5000,
        datatype: "html",
        success: function (data) {
            infoDiv = $.parseHTML(data);
            $("body").after(infoDiv);
            $("#tds_infoDiv").css('max-width', '800px');
            $("#tds_generalInfoText").append(zeeguuInfoText);
            $("#tds_modeSpecificText").append(message);
            $("#originalDestination").attr("href", getDest());
        }
    });
};

getDest = function() {
    var url = window.location.href;
    var regex = new RegExp("[?&]redirect(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results || !results[2]) { return null; }
    var newUrl = decodeURIComponent(results[2].replace(/\+/g, " "));
    if (newUrl.indexOf("?") > -1) {
        newUrl += "&tds_exComplete=true";
    } else {
        newUrl += "?tds_exComplete=true";
    }
    return newUrl;
};

mainFlow();
