/**
 * This file connects the data we read from storage and saved in local variables
 * to the actual html representations of this data.
 */

sortListOnCheckboxVal = function(bsA, bsB) {
    var valueOfA = bsA.getCheckboxVal();
    var valueOfB = bsB.getCheckboxVal();
    if (valueOfA && !valueOfB)
        return -1;
    if (!valueOfA && valueOfB)
        return 1;
    return 0;
};

loadHtmlBlacklist = function(blockedSiteList, table) {
    var list = blockedSiteList.getList();
    list.sort(sortListOnCheckboxVal);
    $.each(list, function(key, value) {
        table.addToTable(table.generateTableRow(value));
    });
};

loadHtmlMode = function(extensionMode, radioGroup) {
    $("input[name=" + radioGroup + "][value=" + extensionMode.label + "]").prop('checked', true);
};

loadHtmlInterval = function(interceptInterval, html_slider) {
    html_slider.setValue(interceptInterval);
};

loadHtmlInterceptCounter = function(count, html_counter) {
    html_counter.text(count);
};

connectLogin = function () {
    $('#sessionGlyphIcon').removeClass('glyphicon-log-out').addClass('glyphicon-log-in');
    $('#sessionMessage').html('Enter email and password to login');
    $('#emailFld').show();
    $('#addon').removeClass('input-group-addon-logout-version');
    $('#addon').html('');
    $('#passwordFld').show();
    html_sessionBtn.off('click', logout);
    html_sessionBtn.on('click', login);
};

connectLogout = function () {
    auth.getDetails().then(function (response) {
        //resolution
        var details = JSON.parse(response);
        console.log(details);
        $('#sessionMessage').html('');
        $('#sessionGlyphIcon').removeClass('glyphicon-log-in').addClass('glyphicon-log-out');
        $('#addon').addClass('input-group-addon-logout-version');
        $('#addon').html('You are logged in as ' + details.name);
        $('#emailFld').hide();
        $('#passwordFld').hide();
        html_sessionBtn.off('click', login);
        html_sessionBtn.on('click', logout);
    });
};