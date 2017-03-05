
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;


function Blacklist () {

    this.links = [];
    this.saveButton = $('#save');
    this.deleteButton = $('#delete');

    this.init = function() { 
        chrome.storage.local.get("blacklist", function(output) {
            if (output.blacklist == null) {
                chrome.storage.local.set({"blacklist" : []}, function() {
                    if(chrome.runtime.error) {
                        console.log("Runtime error.");
                    }
                });  
            }

            this.links = output.blacklist;

            if (!chrome.runtime.error) {
                $.each(output.blacklist, function(key, value) {
                    $('#blacklist').append($("<option></option>").attr("key", key).text(value));
                });
            }
        });
    };
    
    this.saveButton.click(function(){

        var newurl = $('#text').val();
        chrome.storage.local.get("blacklist", function (output) {

            links = output.blacklist;
     
            // Add the url to the local storage.
            links.push("*://"+newurl+"/*");
            chrome.storage.local.set({"blacklist" : links }, function() {
                if(chrome.runtime.error) {
                    console.log("Runtime error.");
                }
                $('#blacklist').append($("<option></option>").text("*://"+newurl+"/*"));

                // Empty the input box.
                $('#text').val('');
                this.init();
            });
        });
    });

    this.deleteButton.click(function() {
        var urltodelete = $("#blacklist option:selected");
        var urlkey = urltodelete.attr("key");

        chrome.storage.local.get("blacklist", function (output) {
            links = output.blacklist;

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


document.addEventListener("DOMContentLoaded", function(){
    var blacklist = new Blacklist();
    blacklist.init();
});


