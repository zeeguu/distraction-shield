/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

loadHtmlBlacklist = function(list, table) {
    //For each BlockedSite object from the list generate a tableRow
    $.each(list, function(key, value) {
        table.addToTable(generateTableRow(value));
    });
    table.sortTableOnChecked();
};

loadHtmlMode = function(extensionMode, radioGroup) {
    $("input[name=" + radioGroup + "][value=" + extensionMode + "]").prop('checked', true);
};

loadHtmlInterceptCounter = function(count, html_counter) {
    html_counter.text(count);
};

