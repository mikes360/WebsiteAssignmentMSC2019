
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

function lockInScores() {
  fetch("/api/game/live/lockscore")
}


function reload() {
  
  fetch("/api/game/live").then((response) => { return response.json() }).then((json) => {

    if("Game Not Started" != json) {

      document.getElementById("totalScore").innerHTML = "Your Current Total Score Is: " + json.totalScore;

      for(var i = 0; i < json.matchResults.length; i++) {
        document.getElementById("score" + (i*2).toString()).innerHTML = " " + json.matchResults[i][0] + "-" + json.matchPredictions[i][0]; 
        document.getElementById("score" + (i*2 + 1).toString()).innerHTML = " " + json.matchResults[i][1] + "-" + json.matchPredictions[i][1]; 

        document.getElementById("userScore" + (i*2 + 1).toString()).innerHTML = "Match Score: " + json.matchScores[i];
      }
      setTimeout(reload, 2000)
    }

  });  
}
