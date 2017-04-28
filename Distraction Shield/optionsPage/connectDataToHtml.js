define(['jquery'], function connectDataToHtml ($) {
    /**
     * This file connects the data we read from storage and saved in local variables
     * to the actual html representations of this data.
     */

    sortListOnCheckboxVal = function (bsA, bsB) {
        var valueOfA = bsA.getCheckboxVal();
        var valueOfB = bsB.getCheckboxVal();
        if (valueOfA && !valueOfB)
            return -1;
        if (!valueOfA && valueOfB)
            return 1;
        return 0;
    };

    loadHtmlBlacklist = function (blockedSiteList, table) {
        var list = blockedSiteList.getList();
        list.sort(sortListOnCheckboxVal);
        $.each(list, function (key, value) {
            table.addToTable(table.generateTableRow(value));
        });
    };

    loadHtmlMode = function (extensionMode, radioGroup) {
        console.log('extensionMode: ' + extensionMode.label); //todo remove
        console.log('radioGroup: ' + radioGroup); //todo remove
        $("input[name=" + radioGroup + "][value=" + extensionMode.label + "]").prop('checked', true);
    };

    loadHtmlInterval = function (interceptInterval, html_slider) {
        html_slider.setValue(interceptInterval);
    };

    loadHtmlInterceptCounter = function (count, html_counter) {
        html_counter.text(count);
    };

    return {
        sortListOnCheckboxVal       : sortListOnCheckboxVal,
        loadHtmlBlacklist           : loadHtmlBlacklist,
        loadHtmlMode                : loadHtmlMode,
        loadHtmlInterval            : loadHtmlInterval,
        loadHtmlInterceptCounter    : loadHtmlInterceptCounter
    }
});

