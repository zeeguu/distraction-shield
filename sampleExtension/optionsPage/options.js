
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

//Local variables that hold the html elements
var html_blacklist = $('#blacklistedSites');
var html_txtFld = $('#textFld');
var html_intCnt = $('#iCounter');

//Local variables that holds the list of links and interceptCounter.
var links = [];
var interceptionCounter = 0;


/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
initOptionsPage = function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter"], function(output) {
        if (handleRuntimeError()) {
            setLocalVariables(output);
            html_intCnt.text(interceptionCounter);
            setHtmlBlacklist(links);
        }
    });
};

setLocalVariables = function(output) {
    links = output.tds_blacklist;
    interceptionCounter = output.tds_interceptCounter;
};

setHtmlBlacklist = function(list) {
    $.each(list, function(key, value) {
        html_blacklist.append($("<option></option>").text(value));
    });
};


/* -------------------- Manipulate storage and variables ------------------- */

updateBackgroundPage = function() {
    var bg = chrome.extension.getBackgroundPage();
    bg.updateBlockedSites(bg.replaceListener);
};

updateStorageBlacklist = function() {
    setStorageBlacklistWithCallback(links, updateBackgroundPage);
};

removeFromAll = function(html_item) {
    removeFromLinks(html_item);
    //update html_blacklist
    html_item.remove();
    updateStorageBlacklist();
};

removeFromLinks = function(html_item) {
    var urlkey = links.indexOf(html_item.val());
    links.splice(urlkey, 1);
};

addToAll = function(item) {
    var stringVal = "*://"+item+"/*";
    links.push(stringVal);
    html_blacklist.append($("<option></option>").text(stringVal));
    updateStorageBlacklist();
};


/* -------------------- Logic for the html buttons -------------------- */

saveButtonClick = function() {
    var newurl = html_txtFld.val();
    addToAll(newurl);
    html_txtFld.val('');
};

deleteButtonClick = function() {
    var urlToDelete = html_blacklist.find('option:selected');
    removeFromAll(urlToDelete)
};

//Connect functions to HTML elements
connectButtons = function() {
    var saveButton = $('#saveBtn');
    saveButton.on('click', saveButtonClick);
    var deleteButton = $('#deleteBtn');
    deleteButton.on('click', deleteButtonClick);
};

/* -------------------- -------------------------- -------------------- */

//Run this when the page is loaded.
document.addEventListener("DOMContentLoaded", function(){
    connectButtons();
    initOptionsPage();
});


