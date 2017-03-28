/**
 * This file contains the specific functionality for the options and its elements
 * This file holds all javascript functions used by the html_elements like buttons and tables.
 * Here things like, onClicked or onChanged events are monitored
 * The last method: connectHtmlFunctionality is called from the options.js file upon initialization.
 */

//Local variables that hold the html elements
var html_table = $('#blacklistTable');
var html_txtFld = $('#textFld');
var html_intCnt = $('#iCounter');
var html_saveButton = $('#saveBtn');
var modeGroup = "modeOptions";


/* -------------------- General functions concerning html_objects -------------------- */

appendHtmlItemTo = function(html_child, html_parent) {
    html_parent.append(html_child);
};

removeFromHtml = function(html_item) {
    html_item.remove();
};

/* -------------------- Logic for the html buttons -------------------- */

removeLinkFromAll = function(html_item) {
    removeFromLocalLinks(html_item);
    removeFromHtml(html_item);
    updateStorageBlacklist();
};

addLinkToAll = function(newUrl) {
    newItem = new BlockedSite(newUrl);
    addToLocalLinks(newItem);
    appendHtmlItemTo(generateHtmlTableRow(newItem), html_table);
    updateStorageBlacklist();
};

saveButtonClick = function() {
    var newurl = html_txtFld.val();
    addLinkToAll(newurl);
    html_txtFld.val('');
};

//Connect functions to HTML elements
connectButton = function(html_button, method) {
    html_button.on('click', method);
};


/* -------------------- Logic for the table -------------------- */

//Returns an html table row object
generateHtmlTableRow = function(blockedSite) {
    var tableRow =
        $("<tr class='table-row' >" +
            "<td>"+blockedSite.icon+"</td>" +
            "<td>"+blockedSite.name+"</td>" +
            "<td width='25'>" + "<input class='checkbox-toggle' type='checkbox' name='state' >" + "</td>" +
            "<td width='25'>" + "<img class='delete-button' type='deleteButton' src='./delete_button.png' width='16' height='16'>" + "</td>" +
            "</tr>");
    tableRow.find('.checkbox-toggle').prop('checked', blockedSite.checkboxVal);
    //add the actual object to the html_element
    tableRow.data('blockedSite', blockedSite);
    return tableRow;
};

// this function makes the passed table single row selection only
enableTableSelection = function (html_table) {
    html_table.on('click', 'tr', function () {
        var row = $(this);
        if (row.hasClass('selected'))
            row.removeClass('selected');
        else
        row.addClass('selected').siblings().removeClass('selected');
    });
};




// this function sorts the html table based on the checkbox value of the tr elements.
sortHtmlOnChecked = function () {
    var rows = html_table.find('tr').get();
    rows.sort(function (checkboxA, checkboxB) {
        var valueOfA = $(checkboxA).find('.checkbox-toggle')["0"].checked;
        var valueOfB = $(checkboxB).find('.checkbox-toggle')["0"].checked;
        if (valueOfA && !valueOfB)
            return -1;
        if (!valueOfA && valueOfB)
            return 1;
        return 0;
    });
    $.each(rows, function (index, row) {
        html_table.append(row);
    });
};

// set one function for all checkboxes found within the passed html_item, this items needs to be selectable
// and needs to have a selected attribute
setCheckboxFunction = function (html_selectable) {
    html_selectable.on('change', 'input[type="checkbox"]', function () {
        var selected_row = $(this).closest('tr');
        var selected_blockedSite = selected_row.data('blockedSite');
        selected_blockedSite.checkboxVal = !selected_blockedSite.checkboxVal;
        //no need to set links cause it holds pointers so they get updated automatically
        updateStorageBlacklist();
    });
};

// if a delete button is clicked, the closest tr element is deleted.
setDeleteButtonFunction = function (html_selectable) {
    html_selectable.on('click', '.delete-button', function () {
        var rowToDelete = $(this).closest('tr');
        removeLinkFromAll(rowToDelete);
    });
};

/* -------------------- Keypress events ----------------------- */

setKeypressFunctions = function () {
    submitWithEnter(html_txtFld);
    deleteOnKeyPress(html_table);
};

submitWithEnter = function (html_elem) {
    html_elem.keyup(function (event) {
        var enterKeyID = 13;
        if (event.keyCode == enterKeyID) {
            saveButtonClick();
        }
    });
};

deleteOnKeyPress = function (html_selectable) {
    $('html').keyup(function (e) {
        var selected_row = html_selectable.find('.selected');
        var deleteKeyID = 46;
        if (e.keyCode == deleteKeyID) {
            removeLinkFromAll(selected_row);
        }
    });
};

/* -------------------- Logic for the mode selection -------------------- */

setRadioButtonFunction = function(buttonGroup) {
    $("input[name=" + buttonGroup + "]").change( function(){
        var pickedMode = $("input[name=" + buttonGroup + "]:checked").val();
        setStorageMode(pickedMode);
    });
};

/* -------------------- Main function that calls the rest -------------------- */

connectHtmlFunctionality = function() {
    enableTableSelection(html_table);
    setCheckboxFunction(html_table);
    setDeleteButtonFunction(html_table);
    setRadioButtonFunction(modeGroup);
    connectButton(html_saveButton, saveButtonClick);
    setKeypressFunctions();
};
