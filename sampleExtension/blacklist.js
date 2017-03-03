
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var blacklist = {

    init: function(){

        var saveButton = $('#save');
        var deleteButton = $('#delete');
        var inputField = $('#text');

        // Every document load, this function is being run. It reads the local storage for the "blacklist" element,
        // and appends the urls to the url list.
        chrome.storage.local.get("blacklist", function(items) {
            if (!chrome.runtime.error) {
                $.each(items.blacklist, function(key, value) {
                    $('#blacklist').append($("<option></option>").attr("key", key).text(value));
                });
            }
        });

        // Whenever the save button is clicked, this function takes the text inside the input field, and saves it
        // to the "blacklist" element in the local storage.
        saveButton.click(function(){
            var newurl = inputField.val();
            chrome.storage.local.get("blacklist", function (output) {
                var links = output.blacklist;

                // Add the url to the local storage.
                links.push("*://"+newurl+"/*");
                chrome.storage.local.set({"blacklist" : links }, function() {
                    if(chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                    $('#blacklist').append($("<option></option>").text("*://"+newurl+"/*"));

                    // Empty the input box.
                    inputField.val('');
                });
            });
        });

        // Whenever an url is selected, and the delete button is clicked, this function deletes the element from the list
        // and from the local storage.
        deleteButton.click(function() {
            var urltodelete = $("#blacklist option:selected");
            var urlkey = urltodelete.attr("key");

            chrome.storage.local.get("blacklist", function (output) {
                var links = output.blacklist;

                // Remove the url from the local storage.
                links.splice(urlkey, 1);
                chrome.storage.local.set({"blacklist" : links }, function() {
                    if(chrome.runtime.error) {
                        console.log("Runtime error.");
                    }

                    // Remove the url from the list.
                    urltodelete.remove();
                });
            });
        });
    }
};

document.addEventListener("DOMContentLoaded", function(){
    blacklist.init();
});


