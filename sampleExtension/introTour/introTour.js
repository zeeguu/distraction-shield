var console = chrome.extension.getBackgroundPage().console;

var tour = new Tour({
    orphan: true,
    steps: [{
        path: "/introTour/introTour.html",
        title: "Welcome to The Distaction Shield",
        content: "This tour will give you a brief demonstration of The Distaction Shield and it's features. If you have " +
        "used The Distaction Shield before click 'End tour' to be taken to the login page, otherwise click 'Next' to continue",
    }, {
        path: "/introTour/introTour.html",
        element: "#tourID",
        title: "Tooltip",
        content: "This is the tooltip button. Clicking on this button opens the tooltip menu, from where you can control" +
        " The Distraction Shield. We'll have a look at it now. Click 'Next' to continue.",
        placement: "bottom"
    }, {
        path: "/tooltipPage/tooltip.html",
        element: "#saveBtn",
        title: "Save Button",
        content: "Clicking this button will add the current website to the blacklist. The Distraction Shield will redirect " +
        "you from all of the websites in your blacklist. Click 'Next' to continue.",
        placement: "right"
    }, {
        path: "/tooltipPage/tooltip.html",
        element: "#statisticsBtn",
        title: "Statistics Button",
        content: "Clicking this button will show you some statistics about your Distraction Shield usage." +
        " Click 'Next' to continue.",
        placement: "right"
    }, {
        path: "/tooltipPage/tooltip.html",
        element: "#optionsBtn",
        title: "Options Button",
        content: "Clicking this button open the options page. We will have a look at this next." +
        " Click 'Next' to continue.",
        placement: "right"
    }, {
        path: "/optionsPage/options.html",
        element: "#modeSelector",
        title: "Mode",
        content: "Here you can select which mode you want The Distraction Shield to use. INSERT MODE EXPLANATION HERE." +
        " Click 'Next' to continue.",
        placement: "left"
    }, {
        path: "/optionsPage/options.html",
        element: "#interval-slider",
        title: "Interval Slider",
        content: "Use the slider to chose how often you want to be redirected. For example if you chose 10 minutes, " +
        "after being redirected once, The Distraction Shield will not redirect you again for another 10 minutes. " +
        " Click 'Next' to continue.",
        placement: "right"

    }, {
        path: "/optionsPage/options.html",
        element: "#blacklistTable",
        title: "Blacklist",
        content: "Here is the list of sites that you will be redirected from. We've added a few suggestions to get you " +
        "started. You can deselect a site to disable redirection on that site temporarily, or remove it completely. " +
        " Click 'Next' to continue.",
        placement: "left"
    }, {
        path: "/optionsPage/options.html",
        element: "#addUrlDiv",
        title: "Add to Blacklist",
        content: "You can also add a site to the blacklist here. Just enter the address and hit save." +
        " Click 'Next' to continue.",
        placement: "left"
    }, {
        path: "/optionsPage/options.html",
        element: "#turnOff-slider",
        title: "Turn Off",
        content: "Need to do some important work and don't want to be redirected? You can use this slider to disable" +
        " The Distraction Shield temporarily. Select the amount of time you want and click 'Turn Off'." +
        " Click 'Next' to continue.",
        placement: "bottom"
    }, {
        path: "/loginPage/login.html",
        element: "#loginForm",
        title: "Login",
        content: "Finally, login with your existing Zeeguu account, or create a new one here to get started." +
        " Good luck learning your new language!",
        placement: "left"
    }],
    onEnd: function () {
        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.update(tab.id, {url: chrome.runtime.getURL('loginPage/login.html')});
        });
    }
});

// Initialize the tour
tour.init();

// Start the tour
tour.start();

//Ends tour If they close the tour tab
chrome.tabs.onRemoved.addListener(function(tabid, removed) {
    tour.end();
});