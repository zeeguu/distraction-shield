/**
 * Created by Eli Ionescu on 3/3/2017.
 */

var popupDiv = $('<div data-role="popup" id="dialogMsg" >' +
    '<iframe src=" https://zeeguu.herokuapp.com/get-ex" width="800" height="600" seamless=""></iframe>' +
    '</div>');
$("body").append(popupDiv);
