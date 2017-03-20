/**
 * Created by Eli Ionescu on 3/16/2017.
 */
console.log("YO");
var skipButton = "<button id='skip' class=\"ui-button ui-corner-all ui-widget\"\> I'm lazy and I want to skip</button>";
$(".home-body").prepend(skipButton);

document.getElementById("skip").addEventListener("click", goToPage);

var reredirectURL;

getStorageReredirectURL = function(callback) {
    chrome.storage.sync.get("reredirecturl", function (ulr) {
        if(handleRuntimeError()) {
           console.out("get reredirect link error")
        }
        reredirectURL = url;
    });

};




function goToPage(){
    getStorageReredirectURL();
    window.location.href = reredirectLink; // a link from the constatns.js
    // window.location.href = reredirectURL;
}
