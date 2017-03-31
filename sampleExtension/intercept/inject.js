mainFlow = function() {
    getStorageMode (initBasis);
};

/*Show some text on the top to indicate we are here because the extension is running*/

initForMode = function(mode) {
    var message;
    if (mode == "pro" || mode == undefined) {
        message = proText;
    } else if(mode == "lazy"){
        message = lazyText;
    }
    return message;
};

initBasis = function(mode) {
    var message = initForMode(mode);

    $.ajax({
        url: chrome.extension.getURL('intercept/inject.html'),
        type: "GET",
        timeout: 5000,
        datattype: "html",
        success: function (data) {
            infoDiv = $.parseHTML(data);
            $("body").prepend(infoDiv);
            $("#tds").width(window.innerWidth + "px");
            $("#tds_generalInfoText").append(infoText);
            $("#tds_modeSpecificText").append(message);
            $("#originalDestination").attr("href", getDest());
        },
    });
}

getDest = function() {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]redirect(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results || !results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

mainFlow();
