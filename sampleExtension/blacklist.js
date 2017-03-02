/**
 * Created by mark on 2-3-17.
 */
document.body.onload = function() {
    chrome.storage.local.get("blacklist", function(items) {
        if (!chrome.runtime.error) {
            $.each(items.blacklist, function(key, value) {
                $('#blacklist').append($("<option></option>").attr("key", key).text(value));
            });
        }
    });
};

document.getElementById("save").onclick = function() {
    var urlelement = $('#text');
    var newurl = urlelement.val();
    chrome.storage.local.get("blacklist", function (output) {
        var links = output.blacklist;
        links.push("*://"+newurl+"/*");
        chrome.storage.local.set({"blacklist" : links }, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
            $('#blacklist').append($("<option></option>").text(newurl));
            urlelement.val('');
        });
    });
};

document.getElementById("delete").onclick = function() {
    var urltodelete = $("#blacklist option:selected");
    var urlkey = urltodelete.attr("key");

    chrome.storage.local.get("blacklist", function (output) {
        var links = output.blacklist;
        links.splice(urlkey, 1);
        chrome.storage.local.set({"blacklist" : links }, function() {
            if (chrome.runtime.error) {
                console.log("Runtime error.");
            }
            urltodelete.remove();
        });
    });
};