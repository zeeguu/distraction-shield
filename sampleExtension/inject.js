/**
 * Created by Eli Ionescu on 3/16/2017.
 */


function goToOriginalDestination(){
    chrome.storage.sync.get("originalDestination", function (url) {
        chrome.runtime.sendMessage({message: "goToOriginalDestination", destination: url.originalDestination});
    });
}

function initLazy() {
    console.log("YO");
    var skipButton = $("\<div> <button id='skip' class=\"ui-button ui-corner-all ui-widget\"\> I'm lazy and I want to skip</button> </div>");
    skipButton.on("click", goToOriginalDestination);
    $(".home-body").prepend(skipButton);
}

initLazy();
