function login()
{
    let username = document.getElementById('username').value
    let password = document.getElementById('password').value
    
    let url = "/login?username=" + username + "&password=" + password;
   
    var myCall = fetch(url).then(function(response) {     
        return response.json();      
    }) .then(function(myJson)  {         
        window.location.href = ""
    }); 
}