
// Log console messages to the background page console instead of the content page.
var console = chrome.extension.getBackgroundPage().console;

//Local variables that hold the html elements
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

// this function makes the table single selection only
initTableSelection = function () {
    html_table.on('click', 'tr', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
    });
};

initCheckBoxes = function () {
    var urlToCheck = html_table.on('change', 'input[type="checkbox"]', function () {
        //Clicking the checkbox automatically selects the row, so we use this to our advantage
        var selected_row = urlToCheck.find('.selected');
        var selected_blockedSite = selected_row.data('blockedSite');
        selected_blockedSite.toggleCheckbox();
        //no need to set links cause it holds pointers so they get updated automatically
        updateStorageBlacklist();
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
    var tableRow =
        $("<tr class='table-row' >" +
            "<td>"+blockedSite.icon+"</td>" +
            "<td>"+blockedSite.name+"</td>" +
            "<td>"+ "<input class='checkbox-toggle' type=\"checkbox\" name=\"state\">" + "</td>" +
        "</tr>");
    //set the checkbox value
    tableRow.find('.checkbox-toggle').prop('checked', blockedSite.checkboxVal);
    //add the actual object to the html_element
    tableRow.data('blockedSite', blockedSite);
    return tableRow;
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
    });
};

appendHtmlItemTo = function(html_child, html_parent) {
    html_parent.append(html_child);
};

/* -------------------- Manipulate local variables ------------------- */

removeFromLocalLinks = function(html_item) {
    var urlkey = links.indexOf(html_item.data('blockedSite'));
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
    updateStorageBlacklist();
};


/* -------------------- Logic for the html buttons -------------------- */

saveButtonClick = function() {
    var newurl = html_txtFld.val();
    addLinkToAll(newurl);
    html_txtFld.val('');
};

deleteButtonClick = function () {
    var urlToDelete = html_table.find(".selected");
    removeLinkFromAll(urlToDelete);
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
    initTableSelection();
    initCheckBoxes();
    initOptionsPage();
});
