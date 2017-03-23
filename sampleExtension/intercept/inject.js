/**
 * Created by Eli Ionescu on 3/16/2017.
 */

function mainFlow() {
    var mode;

    chrome.storage.sync.get("tds_mode", function(result) {
       mode = result.tds_mode;

       initBasis(mode);

        if (mode == "pro" || mode == undefined) {
            initPro();
        } else if(mode == "lazy") {
            initLazy();
        }
    });
}

/*Show some text on the top to indicate we are here because the extension is running*/

function initBasis(mode) {
    var message;
    if (mode = "pro" || mode == undefined) {
        message = proMessage;
    } else {
        message = lazyMessage;
    }

    var lazyDiv =  $("\<div id='tds_lazyDiv' class='ui-corner-all ui-front'></div>");
    var infoP = $("<p align='center'></p>").append(infoMessage);
    var specificP = $("<p align='center'></p>").append(message);

    lazyDiv.append(infoP).append(specificP);
    $("body").prepend(lazyDiv);
}

/*initialize lazy mode*/

function initLazy() {
    var lazyDiv =  $("\<div id='tds_lazyDiv'></div>");
    var skipButton = $("<button id='tds_skipButton' class='ui-button ui-corner-all ui-widget'> I'm lazy and I want to skip</button>");
    skipButton.on("click", function () {
        chrome.storage.sync.get("originalDestination", function (url) {
            chrome.runtime.sendMessage({message: "goToOriginalDestination", destination: url.originalDestination});
        });
    });
    lazyDiv.append(skipButton);
    $(".ex-container").prepend(lazyDiv);
}

/*initialize pro mode*/

function initPro() {
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

}

mainFlow();
