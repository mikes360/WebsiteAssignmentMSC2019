
function login() {
  
  let username = document.getElementById("username").value
  let password = document.getElementById("password").value
  let url = "/api/login?username=" + username + "&password=" + password

  fetch(url).then((response) => { return response.json() }).then((json) => {

      if(json.success) {
        window.location.href = "/"
      }
      else {
        if(json.usernameError) {
          document.getElementById("usernameError").innerHTML = json.usernameError
        }
        if(json.passwordError) {
          document.getElementById("passwordError").innerHTML = json.passwordError
        }
      }

    });
}
