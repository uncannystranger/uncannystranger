function ContactForm() {
  var form = document.getElementById('contactform');
  if (!form) return;
  form.onsubmit = function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    var message = form.elements.comments.value.trim();
    if (!name || !message) return;
    var subject = 'Photography enquiry from ' + name;
    var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    document.getElementById('message').textContent = 'Your email draft is ready to open. Send it from your email app; this website has not sent or stored your message.';
    window.location.href = 'mailto:Abdallahmadm@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  };
}
function ContactMap() { return false; }
