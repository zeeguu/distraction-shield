
var bg = chrome.extension.getBackgroundPage();

var saveButton = $('#saveBtn');
var optionsButton = $('#optionsBtn');
var statisticsButton = $('#statisticsBtn');

saveCurrentPageToBlacklist = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        bg.addUrlToBlockedSites(activeTab.url, setSaveButtonToSuccess);
    });
};

setSaveButtonToSuccess = function () {
    saveButton.attr('class', 'btn btn-success');
    saveButton.html('Successfully added!');
    setTimeout(function () {
        saveButton.attr('class', 'btn btn-info');
        saveButton.html(' Save current page ');
    }, 4000);
};

redirectToStatistics = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
};

openOptionsPage = function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
};

//Connect functions to HTML elements
connectButtons = function() {  
    saveButton.on('click', saveCurrentPageToBlacklist);
    optionsButton.on('click', openOptionsPage);
    statisticsButton.on('click', redirectToStatistics);
};

connectButtons();
