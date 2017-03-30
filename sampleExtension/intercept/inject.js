
mainFlow = function() {
    getStorageMode (initBasis);
};

/*Show some text on the top to indicate we are here because the extension is running*/

initForMode = function(mode) {
    var message;
    if (mode == "pro" || mode == undefined) {
        message = proText;
        initPro();
    } else if(mode == "lazy"){
        message = lazyText;
        initLazy();
    }
    console.log ("initialized "+mode+" mode.")
    return message;
};

initBasis = function(mode) {
    var message = initForMode(mode);

    var infoDiv =  $("\<div id='tds_infoDiv' class='ui-corner-all ui-front'></div>");
    var infoP = $("<p align='center'></p>").append(infoText);
    var specificP = $("<p align='center'></p>").append(message);

    infoDiv.append(infoP).append(specificP);
    $("body").prepend(infoDiv);
};

/*initialize lazy mode*/

initLazy = function() {
    var lazyDiv =  $("\<div id='tds_lazyDiv'></div>");
    var skipButton = $("<button id='tds_skipButton' class='ui-button ui-corner-all ui-widget'> I'm lazy and I want to skip</button>");
    skipButton.on("click", function () {
        chrome.storage.sync.get("originalDestination", function (url) {
            chrome.runtime.sendMessage({message: "goToOriginalDestination", destination: url.originalDestination});
        });
    });
    lazyDiv.append(skipButton);
    $(".ex-container").prepend(lazyDiv);
};

/*initialize pro mode*/

initPro = function() {
    chrome.storage.sync.get("originalDestination", function (url) {
        /* after receiving the original destiniation we attach some code to zeeguu
           This will make sure
         */
        var destination = url.originalDestination;
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
