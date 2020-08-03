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

  document.querySelector('#email').style.display = 'none';


  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
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

  load_mailbox('sent');

  return false;

}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';
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
                              <div class="col"><button>View</button></div>
                              <div class="col">${email.timestamp}</div>            
                            </div>`  


      if (mailbox !== "sent") {


        const archive_unarchive = document.createElement('button');

        archive_unarchive.addEventListener('click', () => arch_unarch(email.id ,mailbox));


        if (mailbox === "inbox"){

          archive_unarchive.innerHTML = "Archive"

        } else{

          archive_unarchive.innerHTML = "Unarchive"

        }

        const col_div = document.createElement('div')

        col_div.className = "col"

        col_div.append(archive_unarchive)

        new_div.childNodes[0].append(col_div)

      }

                  
      if (email.read === true) {

        new_div.style.backgroundColor = "#a39796"
      }

      new_div.childNodes[0].childNodes[5].childNodes[0].addEventListener("click", () => display_mail(mailbox, email.id, mailbox_var, name)); 

      console.log(new_div.childNodes[0].childNodes[2])
 
      document.querySelector('#emails-view').appendChild(new_div);


    })


  })


}


function display_mail( mailbox, id_email, sender_reciver , name_ ) {

  console.log("are you printing?")

  fetch(`emails/${id_email}`)
  .then(response => response.json())
  .then(email_data => {
    document.querySelector('#email').style.display = 'block';    
    document.querySelector('#emails-view').style.display = "none";
    document.querySelector('#email').innerHTML = `<div><b>${name_}:</b>&nbsp${sender_reciver}</div>
                                                  <div><b>Subject:</b>&nbsp${email_data.subject}</div>
                                                  <div><b>Body:</b>&nbsp${email_data.body}</div>
                                                  <div><b>TimeStamp:</b>&nbsp${email_data.timestamp}</div>`

    if (mailbox !== "sent"){

      const reply = document.createElement('button')

      reply.innerHTML = "reply"

      reply.addEventListener('click', () => reply_funct(sender_reciver,email_data.subject, email_data.body,email_data.timestamp ));

      document.querySelector('#email').append(reply)


    }

  })

  console.log(mailbox)

  console.log(mailbox !== "sent")


    fetch(`emails/${id_email}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        read: true
      })
    })

 
}


function arch_unarch(id_email, mailbox) {

  let bool_var = false;

  if (mailbox === "inbox"){

      bool_var = true;
  }

  fetch(`emails/${id_email}`, {
    method:'PUT',
    body: JSON.stringify({
      archived : bool_var
    })
  })
  .then(

    load_mailbox('inbox')

  )


}


function reply_funct(sender, subject,body, time) {

  compose_email();

   document.querySelector('#compose-recipients').value = sender;

   console.log(subject.slice(0,3) === "Re:" )

   if (subject.slice(0,3) === "Re:"){
     console.log("eee")

      document.querySelector('#compose-subject').value = `${subject}`;

   } else {
      document.querySelector('#compose-subject').value = `Re: ${subject}`;
   }
   document.querySelector('#compose-body').value = `On ${time} ${sender} wrote: ${body}`;


}