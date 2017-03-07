

chrome.runtime.sendMessage({message: "loaded"}, function(response) {
    if (response.val == 1) {
        var popupDiv = $('<div data-role="popup" id="dialogMsg" >' +
            '<iframe src=" https://zeeguu.herokuapp.com/get-ex" width="800" height="600" seamless=""></iframe>' +
            '</div>');
        $("body").append(popupDiv);
    }
});