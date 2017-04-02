
mainFlow = function() {
    storage.getMode(initBasis);
    chrome.runtime.sendMessage({message: revertToOriginMessage});
};

determineMode = function(mode) {
    var message;
    if (mode == modes.pro || mode == undefined) {
        message = proText;
    } else if(mode == modes.lazy){
        message = lazyText;
    }
    return message;
};

initBasis = function(mode) {
    var message = determineMode(mode);
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
            $("#originalDestination").on('click', revertToOrigin);
        }
    });
};


revertToOrigin = function() {
    chrome.runtime.sendMessage({message: revertToOriginMessage});
    window.location = getDest();
};

getDest = function() {
    url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]redirect(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results || !results[2]) { return null; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

mainFlow();
