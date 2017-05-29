let feedbackForm = document.getElementById('feedback');
let feedbackbtn = document.getElementById('submit');
let submitMessage = document.getElementById('submitMessage');

//Function for handling the feedback message once submitted. Currently does nothing with the text.
feedbackbtn.onclick = function () {
    let feedbackText = document.getElementById('feedbackText').value.trim();
    if (feedbackText !== '') {
        feedbackForm.style.display = 'none';
        submitMessage.style.display = 'block';
    }
};
