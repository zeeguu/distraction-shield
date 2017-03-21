/**
 * Created by Eli Ionescu on 3/16/2017.
 */
console.log("YO");
var skipButton = $("<button id='skip' class=\"ui-button ui-corner-all ui-widget\"\> I'm lazy and I want to skip</button>");
skipButton.on("click", getStorageReredirectURL)
$(".home-body").prepend(skipButton);

getStorageReredirectURL = function() {
    chrome.storage.sync.get("reredirecturl", function (url) {
        chrome.runtime.sendMessage({message: "goToOriginalDestination", destination: url.reredirecturl});
    });
};
