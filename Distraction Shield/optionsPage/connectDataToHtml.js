/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

export function loadHtmlBlacklist(blockedSiteList, table) {
    let list = blockedSiteList.list;
    list.forEach(value => {
        table.addToTable(table.generateTableRow(value));
    });
}

export function reloadHtmlBlacklist(blockedSiteList, oldBlockedSiteList, table) {
    let oldList = oldBlockedSiteList.list;
    let newList = blockedSiteList.list;
    table.render(newList, oldList)
}

export function loadHtmlMode(extensionMode, radioGroup) {
    $("input[name=" + radioGroup + "][value=" + extensionMode.label + "]").prop('checked', true);
}

export function loadHtmlInterval(interceptInterval, html_slider) {
    html_slider.setValue(interceptInterval);
}

export function loadHtmlInterceptCounter(count, html_counter) {
    html_counter.text(count);
}

