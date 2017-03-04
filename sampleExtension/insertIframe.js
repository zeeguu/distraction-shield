/**
 * Created by Eli Ionescu on 3/3/2017.
 */
// $(document).showPopup("<iframe src=\" http://zeeguu.herokuapp.com/get-ex\" width=\"700\" height=\"530\" seamless=\"\"></iframe>");
var popupDiv = $('<div data-role="popup" id="dialogMsg" >' +
    '<iframe src=" https://zeeguu.herokuapp.com/get-ex" width="800" height="600" seamless=""></iframe>' +
    '</div>');
$("body").prepend(popupDiv);
$.getScript(chrome.extension.getURL("iframe.js"));