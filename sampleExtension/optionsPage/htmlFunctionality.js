/**
 * This file contains the specific functionality for the options and some of its elements
 * This file holds all javascript functions used by the html_elements like buttons and fields.
 * Here things like, onClicked or onChanged events are monitored
 */

appendHtmlItemTo = function(html_child, html_parent) {
    html_parent.append(html_child);
};

prependHtmlItemTo = function (html_child, html_parent) {
    html_parent.prepend(html_child);
};

removeBlockedSiteFromAll = function(html_item) {
    removeFromLocalBlacklist(html_item);
    blacklistTable.removeFromTable(html_item);
    synchronizer.syncBlacklist(blacklist);
};

addBlockedSiteToAll = function(newItem) {
    if (addToLocalBlacklist(newItem)) {
        blacklistTable.addToTable(blacklistTable.generateTableRow(newItem));
        synchronizer.syncBlacklist(blacklist);
    }
};

createNewBlockedSite = function (newUrl) {
    urlFormatter.getUrlFromServer(newUrl, function (url, title) {
        newItem = new BlockedSite(url, title);
        return addBlockedSiteToAll(newItem);
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
};

submitOnKeyPress = function (html_elem) {
    html_elem.keyup(function (event) {
        if (event.keyCode == KEY_ENTER) {
            saveNewUrl();
        }
    });
};

/* -- Deprecated -- */
// deleteOnKeyPress = function (blacklistTable) {
//     $('html').keyup(function (e) {
//         if (e.keyCode == KEY_DELETE) {
//             blacklistTable.removeSelected();
//         }
//     });
// };

/* -------------------- Logic for the mode selection -------------------- */

initModeSelection = function(buttonGroup) {
    $("input[name=" + buttonGroup + "]").change( function(){
        settings_object.setMode($("input[name=" + buttonGroup + "]:checked").val());
        synchronizer.syncSettings(settings_object);
    });
};


/* -------------------- Interval slider -------------------- */

initIntervalSlider = function() {
    intervalSlider = new GreenToRedSlider('#interval-slider', function (value) {
        settings_object.setInterceptionInterval(parseInt(value));
        synchronizer.syncSettings(settings_object);
    });
};
