var feedbackForm = document.getElementById('feedback');
var feedbackbtn = document.getElementById('submit');
var loader = document.getElementById('loader');
var submitMessage = document.getElementById('submitMessage');

function sendMail(from, content) {
  var http = new XMLHttpRequest();
  var url = "https://distraction-shield-mail-server.herokuapp.com/";
  var params = "from=" + from + "&content=" + content;
  http.open("POST", url, true);

  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  http.onreadystatechange = function() {//Call a function when the state changes.
      loader.style.display = 'none';

      if (http.readyState == 4 && http.status == 200) {
        submitMessage.innerHTML = "Thanks for the feedback!";
      } else {
        submitMessage.innerHTML = "Something went wrong...";
      }
  }
  http.send(params);
}

//Function for handling the feedback message once submitted. Currently does nothing with the text.
feedbackbtn.onclick = function() {
    var emailText = document.getElementById('emailText').value.trim();
    var feedbackText = document.getElementById('feedbackText').value.trim();
    if(emailText != '' && feedbackText != '') {
        loader.style.display = 'block';
        feedbackForm.style.display = 'none';
        submitMessage.style.display = 'block';

        sendMail(emailText, feedbackText);
    }
};
