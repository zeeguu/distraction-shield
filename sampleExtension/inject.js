/**
 * Created by Eli Ionescu on 3/16/2017.
 */


function goToOriginalDestination(){
    chrome.storage.sync.get("originalDestination", function (url) {
        chrome.runtime.sendMessage({message: "goToOriginalDestination", destination: url.originalDestination});
    });
}

function initLazy() {
    console.log("Mode = lazy");
    var skipButton = $("\<div> <button id='skip' class=\"ui-button ui-corner-all ui-widget\"\> I'm lazy and I want to skip</button> </div>");
    skipButton.on("click", goToOriginalDestination);
    $(".home-body").prepend(skipButton);
}


function initPro() {
    chrome.storage.sync.get("originalDestination", function (url) {
        var destination = url.originalDestination;

        console.log("Mode = pro");
        console.log("received: " + destination);

        //Insert into pages javascript env
        // var s = document.createElement('script');
        // var sContent = `(` + function (destination) {
        //         alert("this happens");
        //         var originalDestination = destination;
        //     } + ')(' + JSON.stringify(destination) + ');';
        // s.textContent = sContent;
        // (document.head || document.documentElement).appendChild(s);

        var s2 = document.createElement('script');
        s2.src = chrome.extension.getURL('bindEvents.js');
        s2.onload = function() {
            var s = document.createElement('script');
            var sContent = '(addGenCompletedEvent)(' + JSON.stringify(destination) + ');';
            s.textContent = sContent;
            (document.head || document.documentElement).appendChild(s);
            this.remove();
        };
        (document.head || document.documentElement).appendChild(s2);
    });

}
// initLazy();
initPro();


