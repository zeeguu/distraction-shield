/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

export function sortListOnCheckboxVal(bsA, bsB) {
    let valueOfA = bsA.checkboxVal;
    let valueOfB = bsB.checkboxVal;
    if (valueOfA && !valueOfB)
        return -1;
    if (!valueOfA && valueOfB)
        return 1;
    return 0;
}

export function loadHtmlBlacklist(blockedSiteList, table) {
    let list = blockedSiteList.list;
    list.sort(sortListOnCheckboxVal);
    $.each(list, function (key, value) {
        table.addToTable(table.generateTableRow(value));
    });
}

export function loadHtmlMode(extensionMode, radioGroup) {
    $("input[name=" + radioGroup + "][value=" + extensionMode.label + "]").prop('checked', true);
}

export function loadHtmlInterval(interceptInterval, html_slider) {
    html_slider.setValue(interceptInterval);
}

export function loadHtmlInterceptCounter(count, html_counter) {
    html_counter.text(count);
<<<<<<< HEAD
}

=======
};
>>>>>>> development
