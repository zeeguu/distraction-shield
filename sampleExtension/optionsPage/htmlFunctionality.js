/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */

appendHtmlItemTo = function(html_child, html_parent) {
    html_parent.append(html_child);
};

removeLinkFromAll = function(html_item) {
    removeFromLocalLinks(html_item);
    blacklistTable.removeSelected();
    updateStorageBlacklist();
};

addLinkToAll = function(newItem) {
    addToLocalLinks(newItem);
    blacklistTable.addToTable(generateTableRow(newItem));
    updateStorageBlacklist();
   
};

createNewBlockedSite = function (newUrl) {
    submitUrl(newUrl, function (url, title) {
        newItem = new BlockedSite(url, title);
        return addLinkToAll(newItem);
    });
};

/* -------------------- Button Click functions ----------------------- */

saveNewUrl = function() {
    var newUrl = html_txtFld.val();
    createNewBlockedSite(newUrl);
    html_txtFld.val('');
};

//Connect functions to HTML elements
connectButton = function(html_button, method) {
    html_button.on('click', method);
};

/* -------------------- Keypress events ----------------------- */

setKeyPressFunctions = function () {
    submitOnKeyPress(html_txtFld);
    deleteOnKeyPress(blacklistTable);
};

submitOnKeyPress = function (html_elem) {
    html_elem.keyup(function (event) {
        var enterKeyID = 13;
        if (event.keyCode == enterKeyID) {
            saveNewUrl();
        }
    });
};

deleteOnKeyPress = function (blacklistTable) {
    $('html').keyup(function (e) {
        var deleteKeyID = 46;
        if (e.keyCode == deleteKeyID) {
            blacklistTable.removeSelected();
        }
    });
};
/* -------------------- Logic for the mode selection -------------------- */

initModeSelection = function(buttonGroup) {
    $("input[name=" + buttonGroup + "]").change( function(){
        var pickedMode = $("input[name=" + buttonGroup + "]:checked").val();
        setStorageMode(pickedMode);
    });
};
