
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

var html_blacklist = $('#blacklistedSites');
var html_txtFld = $('#textFld');
var html_intCnt = $('#iCounter');
//Local variable that holds the list of links that we are blacklisting.
var links = [];
var interceptionCounter = 0;

//Initialize HTML elements and set the local variables
setLinksAndBlacklistList = function() {
    chrome.storage.sync.get("tds_blacklist", function(output) {
        links = output.tds_blacklist;
        if (!chrome.runtime.error) {
            //For every element in the array append it to the html blacklist
            $.each(links, function (key, value) {
                html_blacklist.append($("<option></option>").text(trimURL(value)));
            });
        }
    });
    chrome.storage.sync.get("tds_interceptCounter", function(output) {
        interceptionCounter = output.tds_interceptCounter;
        if (!chrome.runtime.error) {
            html_intCnt.text(interceptionCounter);
        }
    });
};


/* -------------------- Logic for the html buttons -------------------- */
//TODO check validity of URL & if list already contains -> do nothing
saveButtonClick = function() {
    var tempurl = html_txtFld.val();
    var newurl = createURI(tempurl);
    // Add the url to the sync storage.
    links.push("*://"+newurl+"/*");
    chrome.storage.sync.set({"tds_blacklist" : links }, function() {
        if(chrome.runtime.error) {
            console.log("Runtime error.");
        }
        //Append element to the html blacklist
        html_blacklist.append($("<option></option>").text(newurl));
        // Empty the input box.
        html_txtFld.val('');
        var bg = chrome.extension.getBackgroundPage();
        bg.updateBlockedSites(bg.replaceListener);
    });
};

deleteButtonClick = function() {
    var urltodelete = $("#blacklistedSites").find('option:selected');
    var urlkey = links.indexOf(urltodelete.val());
    // Remove the url from the sync storage.
    links.splice(urlkey, 1);
    chrome.storage.sync.set({"tds_blacklist" : links}, function() {
        if(chrome.runtime.error) {
            console.log("Runtime error.");
        }
        // Remove the url from the list.
        urltodelete.remove();
        var bg = chrome.extension.getBackgroundPage();
        bg.updateBlockedSites(bg.replaceListener);
    });
};

//Connect functions to HTML elements
connectButtons = function() {
    var saveButton = $('#saveBtn');
    saveButton.on('click', saveButtonClick);
    var deleteButton = $('#deleteBtn');
    deleteButton.on('click', deleteButtonClick);
};

/* -------------------- -------------------------- -------------------- */

// since urls are stored in format *:// +url+ /*, we can nicely display them by trimming the string
trimURL = function (str) {
    return str.substring(4, str.length - 2);
}


// this returns a string containing only the hostname of the website.
createURI = function (str) {
    if (!/^https?:\/\//i.test(str)) {
        str = 'http://' + str;
    }
    var uri = new URI();
    uri = URI.parse(str);
    return uri.hostname;
}

getFavIcon = function (url) {
    return "http://www.google.com/s2/favicons?domain=" + url;
}

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectButtons();
    setLinksAndBlacklistList();
});


