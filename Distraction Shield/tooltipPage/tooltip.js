import * as $ from "../../dependencies/jquery/jquery-1.10.2";

    let saveButton = $('#saveBtn');
    let optionsButton = $('#optionsBtn');
    let statisticsButton = $('#statisticsBtn');

    saveCurrentPageToBlacklist = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            let activeTab = arrayOfTabs[0];
            chrome.runtime.sendMessage({message : "newUrl", unformattedUrl : activeTab.url}, setSaveButtonToSuccess());
        });
    };

    setSaveButtonToSuccess = function () {
        saveButton.attr('class', 'btn btn-success');
        saveButton.html('Successfully added!');
        setTimeout(function () {
            saveButton.attr('class', 'btn btn-info');
            saveButton.html('Block');
        }, 4000);
    };

    redirectToStatistics = function () {
        chrome.tabs.create({'url': chrome.runtime.getURL('statisticsPage/statistics.html')});
    };

    openOptionsPage = function () {
        chrome.tabs.create({'url': chrome.runtime.getURL('optionsPage/options.html')});
    };


    //Connect functions to HTML elements
    connectButtons = function () {
        saveButton.on('click', saveCurrentPageToBlacklist);
        optionsButton.on('click', openOptionsPage);
        statisticsButton.on('click', redirectToStatistics);
    };

    connectButtons();

