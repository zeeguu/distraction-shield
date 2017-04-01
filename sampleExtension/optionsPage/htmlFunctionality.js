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

addLinkToAll = function(newUrl) {
    newItem = new BlockedSite(newUrl);
    addToLocalLinks(newItem);
    blacklistTable.addToTable(generateTableRow(newItem));
    updateStorageBlacklist();
};

/* -------------------- Logic for the buttons -------------------- */

//Connect functions to HTML elements
connectButton = function(html_button, method) {
    html_button.on('click', method);
};

saveButtonClick = function() {
    var newurl = html_txtFld.val();
    addLinkToAll(newurl);
    html_txtFld.val('');
};

deleteButtonClick = function () {
    var urlToDelete = blacklistTable.getSelected();
    removeLinkFromAll(urlToDelete);
};

/* -------------------- Logic for new url TextField -------------------- */

initSubmitWithEnter = function(txtFld) {
    txtFld.keyup(function (event) {
        var enterKeyID = 13;
        if (event.keyCode == enterKeyID) {
            saveButtonClick();
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
