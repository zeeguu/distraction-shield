/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

loadHtmlBlacklist = function(blockedSiteList, table) {
    //For each BlockedSite object from the list generate a tableRow
    var list = blockedSiteList.getList();
    $.each(list, function(key, value) {
        table.addToTable(table.generateTableRow(value));
    });
    table.sortTableOnChecked();
};

loadHtmlMode = function(extensionMode, radioGroup) {
    $("input[name=" + radioGroup + "][value=" + extensionMode + "]").prop('checked', true);
};

loadHtmlInterval = function(interceptInterval, html_slider) {
    html_slider.setValue(interceptInterval);
};

loadHtmlInterceptCounter = function(count, html_counter) {
    html_counter.text(count);
};

