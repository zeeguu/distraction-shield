/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

loadHtmlBlacklist = function(list) {
    //For each BlockedSite object from the list generate a tableRow
    console.log("loadHtmlBlacklist");//TODO remove
    $.each(list, function(key, value) {
        appendHtmlItemTo(generateHtmlTableRow(value), html_table);
    });
    // sortHtmlOnChecked(html_table);
};

loadHtmlMode = function(extensionMode) {
    $("input[name=modeOptions][value=" + extensionMode + "]").prop('checked', true);
};

loadHtmlInterceptCounter = function(count) {
    html_intCnt.text(count);
};

connectLocalDataToHtml = function() {
    loadHtmlInterceptCounter(interceptionCounter);
    loadHtmlBlacklist(links);
    loadHtmlMode(mode);
};
