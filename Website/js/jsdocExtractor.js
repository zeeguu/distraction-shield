document.addEventListener("DOMContentLoaded", function () {
    var navbar = document.getElementsByClassName('jsdocs-navbar');
    var content = document.getElementsByClassName('jsdocs-content');
    var title = document.getElementsByClassName('jsdocs-title');

    navbar[0].addEventListener('click', function(a){
        if (a.srcElement.id === "navbar-link"){
          a.preventDefault();
          var link = a.srcElement.href;
          title[0].innerHTML = a.srcElement.innerHTML;
          requestHTML(link, content[0]);
        }
    });
});

function requestHTML(link, elem){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', link, true);
    xhr.send();
    xhr.onload = function(){
        var xml = (/<article.*?>(?:[\t\n\r]*)([\w\W]*?)(?:[\t\n\r]*)<\/article>/m).exec(xhr.responseText)[0];
        elem.innerHTML = (xml ? xml : '');
    }
}
