/**
 * Created by Eli Ionescu on 3/16/2017.
 */
console.log("YO");
var skipButton = $("<button id='skip' class=\"ui-button ui-corner-all ui-widget\"\> I'm lazy and I want to skip</button>");
skipButton.on("click", goToOriginalDestination);
$(".ex-container").prepend(skipButton);

function goToOriginalDestination(){
    chrome.storage.sync.get("originalDestination", function (url) {
        chrome.runtime.sendMessage({message: "goToOriginalDestination", destination: url.originalDestination});
    });
}
