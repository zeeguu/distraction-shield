define ('htmlFunctionality', ['GreenToRedSlider','TurnOffSlider','blockedSiteBuilder','synchronizer','constants','jquery'],
    function htmlFunctionality (GreenToRedSlider, TurnOffSlider, blockedSiteBuilder, synchronizer, constants, $) {

    /**
     * This file contains the specific functionality for the options and some of its elements
     * This file holds all javascript functions used by the html_elements like buttons and fields.
     * Here things like, onClicked or onChanged events are monitored
     */
    var html_txtFld = $('#textFld');

    appendHtmlItemTo = function (html_child, html_parent) {
        html_parent.append(html_child);
    };

    prependHtmlItemTo = function (html_child, html_parent) {
        html_parent.prepend(html_child);
    };

    /* -------------------- Button Click functions ----------------------- */

    saveNewUrl = function () {
        var newUrl = html_txtFld.val();
        blockedSiteBuilder.createNewBlockedSite(newUrl, addBlockedSiteToAll);
        html_txtFld.val('');
    };

    //Connect functions to HTML elements
    connectButton = function (html_button, method) {
        html_button.on('click', method);
    };

    /* -------------------- Keypress events ----------------------- */

    setKeyPressFunctions = function (html_txtFld, blacklistTable) {
        submitOnKeyPress(html_txtFld);
        deleteOnKeyPress(blacklistTable);
    };

    submitOnKeyPress = function (html_elem) {
        html_elem.keyup(function (event) {
            if (event.keyCode == constants.KEY_ENTER) {
                saveNewUrl();
            }
        });
    };

    deleteOnKeyPress = function (blacklistTable) {
        $('html').keyup(function (e) {
            if (e.keyCode == constants.KEY_DELETE) {
                var html = blacklistTable.getSelected();
                removeBlockedSiteFromAll(html);
            }
        });
    };

    /* -------------------- Logic for the mode selection -------------------- */

    initModeSelection = function (buttonGroup, settings_object) {
        $("input[name=" + buttonGroup + "]").change(function () {
            var selectedMode = $("input[name=" + buttonGroup + "]:checked").val();
            if (selectedMode == 'pro') {
                settings_object.setMode(constants.modes.pro);
            } else {
                settings_object.setMode(constants.modes.lazy);
            }
            synchronizer.syncSettings(settings_object);
        });
    };

    /* -------------------- Interval slider -------------------- */

    initIntervalSlider = function (settings_object) {
        return new GreenToRedSlider.GreenToRedSlider('#interval-slider', function (value) {
            settings_object.setInterceptionInterval(parseInt(value));
            synchronizer.syncSettings(settings_object);
        });
    };

    return {
        appendHtmlItemTo : appendHtmlItemTo,
        prependHtmlItemTo : prependHtmlItemTo,
        saveNewUrl : saveNewUrl,
        connectButton : connectButton,
        setKeyPressFunctions : setKeyPressFunctions,
        submitOnKeyPress : submitOnKeyPress,
        deleteOnKeyPress : deleteOnKeyPress,
        initModeSelection : initModeSelection,
        initIntervalSlider : initIntervalSlider

    }
});
