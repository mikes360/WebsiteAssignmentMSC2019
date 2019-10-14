<<<<<<< Updated upstream
function login()
{
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    
    let url = "/login?username=" + username + "&password=" + password;
   
    var myCall = fetch(url).then(function(response) {     
        return response.json();      
    }) .then(function(myJson)  {         
        window.location.href = "/"
    }); 
}
=======
function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  let url = "/login?username=" + username + "&password=" + password;

  var myCall = fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      window.location.href = "index.html";
    });
}

//function Register??
document.getElementById("addForm").addEventListener("submit", function(ev) {
  ev.preventDefault();
  let url = "/api/user";
  let formData = {
    userFirstName: document.getElementById("firstname").value,
    userLastName: document.getElementById("lastname").value,
    userUserName: document.getElementById("username").value,
    userPassword: document.getElementById("password").value,
    userEmail: document.getElementById("email").value
  };

  fetch(url, {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.json())
    .then(function(response) {
      console.log("Success");
      console.dir(JSON.stringify(response));
      console.dir(response);
      window.location.href = "/thank-you.html"; //change to "succesful register!" page?
    })
    .catch(function(error) {
      console.error("Error:", error);
    });
});
>>>>>>> Stashed changes
