document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email)

  // By default, load the inbox
  load_mailbox('inbox');

  document.querySelector('#compose-form').onsubmit = send_email;

  });


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
<<<<<<< HEAD

  document.querySelector('#compose-view').style.display = 'block';
=======
>>>>>>> ViewEmail

  document.querySelector('#email').style.display = 'none';


  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';

<<<<<<< HEAD
=======
  document.querySelector('#email').style.display = 'none';

>>>>>>> ViewEmail
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    console.log(emails)

  
    emails.forEach(email => {

      const  new_div = document.createElement('div')

      new_div.className = 'container'

      new_div.style.border = "thin solid #000000";

      new_div.style.marginBottom = "20px"

      let mailbox_var = email.sender

      let name = "Sender"

      if (mailbox === "sent") {

        mailbox_var = email.recipients

        name = "Recipients"
       
      }
    
      new_div.innerHTML = `<div class="row">
                            <div class="col"><b>${mailbox_var}</b></div>
                            <div class="col">${email.subject}</div>
                            <div class="col">${email.timestamp}</div>
                          </div>`                 

      if (email.read) {

        new_div.style.backgroundColor = "#a39796"
      }

<<<<<<< HEAD
      
                          
      document.querySelector('#email-view').append(new_div)
=======
      new_div.addEventListener("click", () => display_mail(email.id, mailbox_var, name)); 
 
      document.querySelector('#emails-view').append(new_div)
>>>>>>> ViewEmail

    })

  })


}

function send_email() {

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector("#compose-recipients").value,
        subject: document.querySelector("#compose-subject").value,
        body: document.querySelector("#compose-body").value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);

  });

  load_mailbox('sent')

  return false;

}




function display_mail(id_email, sender_reciver , name_ ) {

  fetch(`emails/${id_email}`)
  .then(response => response.json())
  .then(email_data => {
    document.querySelector('#email').style.display = 'block';    
    document.querySelector('#emails-view').style.display = "none";
    document.querySelector('#email').innerHTML = `<div><b>${name_}:</b>&nbsp${sender_reciver}</div>
                                                  <div><b>Subject:</b>&nbsp${email_data.subject}</div>
                                                  <div><b>Body:</b>&nbsp${email_data.body}</div>
                                                  <div><b>TimeStamp:</b>&nbsp${email_data.timestamp}</div>`
  })

  fetch(`emails/${id_email}`, {
    method: 'PUT',
    body: JSON.stringify({ 
      read: true
    })
  })

}