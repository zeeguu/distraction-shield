
mainFlow = function() {
    storage.getMode (initBasis);
};

determineMode = function(mode) {
    var message;
    if (mode == modes.pro || mode == undefined) {
        message = proText;
        initProMode();
    } else if(mode == modes.lazy){
        message = lazyText;
        initLazyMode();
    }
    return message;
};

initBasis = function(mode) {
    var message = determineMode(mode);

    var infoDiv =  $("\<div id='tds_infoDiv' class='ui-corner-all ui-front'></div>");
    var infoP = $("<p align='center'></p>").append(infoText);
    var specificP = $("<p align='center'></p>").append(message);

    infoDiv.append(infoP).append(specificP);
    $("body").prepend(infoDiv);
};

/*initialize lazy mode*/

initLazyMode = function() {
    var lazyDiv =  $("\<div id='tds_lazyDiv'></div>");
    var skipButton = $("<button id='tds_skipButton' class='ui-button ui-corner-all ui-widget'> I'm lazy and I want to skip</button>");
    skipButton.on("click", function () {
        storage.getOriginalDestination(function (originalDestination) {
            chrome.runtime.sendMessage({message: revertToOriginMessage, destination: originalDestination});
        });
    });
    lazyDiv.append(skipButton);
    $(".ex-container").prepend(lazyDiv);
};

/*initialize pro mode*/

initProMode = function() {
    storage.getOriginalDestination(function (originalDestination) {
        /* after receiving the original destiniation we attach some code to zeeguu
           This will make sure
         */
        var destination = originalDestination.originalDestination;
        var defBindEvents = document.createElement('script');
        defBindEvents.src = chrome.extension.getURL('intercept/bindEvents.js');
        defBindEvents.onload = function() {
            var callBindEvents = document.createElement('script');
            callBindEvents.textContent = '(subToCompletedEvent)(' + JSON.stringify(destination) + ');';
            (document.head || document.documentElement).appendChild(callBindEvents);
            this.remove();
        };
        (document.head || document.documentElement).appendChild(defBindEvents);
    });

};

mainFlow();
