
// Log console messages to the background page console instead of the content page.
//var console = chrome.extension.getBackgroundPage().console;

//Local variables that hold the html elements
var html_blacklist = $('#blacklistedSites');
var html_table = $('#blacklistTable');
var html_txtFld = $('#textFld');
var html_intCnt = $('#iCounter');

//Local variables that holds the list of links and interceptCoun and variables ter.
var links = [];
var interceptionCounter = 0;


/* -------------------- Initialization of options --------------------- */

//Initialize HTML elements and set the local variables
initOptionsPage = function() {
    chrome.storage.sync.get(["tds_blacklist", "tds_interceptCounter"], function(output) {
        if (handleRuntimeError()) {
            setLocalVariables(output);
            setHtmlElements();
        }
    });
};

/* -------------------- Manipulate storage ------------------- */

updateStorageBlacklist = function() {
    setStorageBlacklistWithCallback(links, updateBackgroundPage);
};


/* -------------------- Manipulate background ------------------- */

updateBackgroundPage = function() {
    var bg = chrome.extension.getBackgroundPage();
    bg.updateBlockedSites(bg.replaceListener);
};

/* -------------------- Manipulate Html elements ------------------- */

generateHtmlTableRow = function(blockedSite) {
    return $("<tr class='table-row' >" +
                "<td>"+blockedSite.icon+"</td>" +
                "<td>"+blockedSite.name+"</td>" +
                "<td>"+ "<input type=\"checkbox\" name=\"state\" checked=\"" + blockedSite.checkboxVal + "\">" + "</td>" +
             "</tr>");
};

generateHtmlListOption = function(blockedSite) {
    return $("<option></option>").text(blockedSite.name);
};

removeFromHtml = function(html_item) {
    html_item.remove();
};

setHtmlElements = function() {
    html_intCnt.text(interceptionCounter);
    setHtmlBlacklist(links);
};

setHtmlBlacklist = function(list) {
    $.each(list, function(key, value) {
        appendHtmlItemTo(generateHtmlTableRow(value), html_table);
        appendHtmlItemTo(generateHtmlListOption(value), html_blacklist);
    });
};

appendHtmlItemTo = function(html_child, html_parent) {
    html_parent.append(html_child);
};

/* -------------------- Manipulate local variables ------------------- */

//TODO duplicate name removal will result in problems
removeFromLocalLinks = function(html_item) {
    var urlkey = links.indexOf(html_item.val());
    links.splice(urlkey, 1);
};


setLocalVariables = function(storage_output) {
    links = storage_output.tds_blacklist;
    interceptionCounter = storage_output.tds_interceptCounter;
};

addUrlToLocal = function(blockedSite) {
    links.push(blockedSite);
};

/* -------------------- general manipulation functions ------------------- */

removeLinkFromAll = function(html_item) {
    removeFromLocalLinks(html_item);
    removeFromHtml(html_item);
    updateStorageBlacklist();
};

addLinkToAll = function(newUrl) {
    newItem = new BlockedSite(newUrl);
    addUrlToLocal(newItem);
    appendHtmlItemTo(generateHtmlTableRow(newItem), html_table);
    appendHtmlItemTo(generateHtmlListOption(newItem), html_blacklist);
    updateStorageBlacklist();
};


/* -------------------- Logic for the html buttons -------------------- */

saveButtonClick = function() {
    var newurl = html_txtFld.val();
    addLinkToAll(newurl);
    html_txtFld.val('');
};

deleteButtonClick = function() {
    var urlToDelete = html_blacklist.find('option:selected');
    removeLinkFromAll(urlToDelete)
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
