
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;


function Blacklist () {

    this.links = [];
    this.saveButton = $('#save');
    this.deleteButton = $('#delete');

    this.init = function() { 
        chrome.storage.sync.get("blacklist", function(output) {
            if (output.blacklist == null) {
                chrome.storage.sync.set({"blacklist" : []}, function() {
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
        chrome.storage.sync.get("blacklist", function (output) {

            links = output.blacklist;
     
            // Add the url to the sync storage.
            links.push("*://"+newurl+"/*");
            chrome.storage.sync.set({"blacklist" : links }, function() {
                if(chrome.runtime.error) {
                    console.log("Runtime error.");
                }
                $('#blacklist').append($("<option></option>").attr("key", links.length).text("*://"+newurl+"/*"));

                // Empty the input box.
                $('#text').val('');
                var bg = chrome.extension.getBackgroundPage().background;
                bg.retrieveBlacklist(bg.addWebRequestListener);
            });
        });
    });

    this.deleteButton.click(function() {
        var urltodelete = $("#blacklist option:selected");
        

        chrome.storage.sync.get("blacklist", function (output) {
            links = output.blacklist;
            var urlkey = links.indexOf(urltodelete.val());
            // Remove the url from the sync storage.
            links.splice(urlkey, 1);
            chrome.storage.sync.set({"blacklist" : links }, function() {
                if(chrome.runtime.error) {
                    console.log("Runtime error.");
                }

                // Remove the url from the list.
                urltodelete.remove();
                var bg = chrome.extension.getBackgroundPage().background;
                bg.retrieveBlacklist(bg.addWebRequestListener);
            });
        });
    });

}


document.addEventListener("DOMContentLoaded", function(){
    var blacklist = new Blacklist();
    blacklist.init();
});


