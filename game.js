const controller = require("./controller");

function startGame(app) {
  // this needs to be set from the database
  // get the upcoming game and set a timer to go off when the games all start

  //let game = await controller.getGame(app);

  setTimeout(gameLogic, 1000 * 10, app);
}

async function gameLogic(app) {
  // array to hold results
  let snitchCatchTime = getRandomInt(5, 30);
  let snitchCatchTeam = 1;
  let matchResults = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

  // build some results
  for (var i = 0; i < matchResults.length; i++) {
    matchResults[i][0] = createMatchScore(100, 300);
    matchResults[i][1] = createMatchScore(100, 300);
    matchResults[i][getRandomInt(0, 1)] += 150;
  }

  // get users
  let users = await controller.getUsers(app);

  for (var i = 0; i < users.length; i++) {
    let user = users[i];

    if (user.game[0].firstGoldenSnitchTimePrediction == snitchCatchTime) {
      user.game[0].totalScore += 50;
    }

    if (user.game[0].firstGoldenSnitchTeamPrediction == snitchCatchTeam) {
      user.game[0].totalScore += 20;
    }

    // calculate users scores
    let userMatchScores = getMatchScores(user, matchResults);
    console.log("User " + user.username + " scores " + userMatchScores);

    for (var x = 0; x < userMatchScores.length; x++) {
      user.game[0].totalScore += userMatchScores[x];
    }

    // save the scores in the user json
    user.games[0].matchScores = userMatchScores;
    user.games[0].matchResults = matchResults;

    await controller.updateUser(app, user);
  }
}

//calculates total score for a team in a match
function createMatchScore(min, max) {
  let score = getRandomInt(min, max) + addSnitchPoints();
  return score;
}

function getRandomInt(min, max) {
  return Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
  //Both max and min scores are inclusive
  //Returns integer score in multiples of 10
}

//Randomly chooses one team from match and adds 150 snitch points to their score
function addSnitchPoints(snitchTeam) {
  let snitchPoints = 150;
  var snitchTeam = match[i].team[Math.floor(Math.random() * team.length)];
  return (snitchTeam.matchResults[i] += snitchPoints);
}

function getGoldenSnitchTeamResult() {
  let snitchTeamResult = user.games.firstGoldenSnitchTeamResult;
  return (snitchTeamresults = snitchTeam.name);
}

function getMatchScores(user, results) {
  let predictions = user.games[i].matchPredictions;

  // loop round the results and calculate score for each match based on a point system
  let userScores = [0, 0, 0, 0, 0, 0];

  for (var i = 0; i < predictions.length; i++) {
    let matchScore = 0; // calculate score
    let prediction = predictions[i];
    let result = results[i];

    if (result[0] === prediction[0]) {
      matchScore += 10;
    }
    if (result[1] === prediction[1]) {
      matchScore += 10;
    }
    if (result[0] === prediction[0] && result[1] === prediction[1]) {
      matchScore += 10;
    }

    userScores[i] = matchScore;
  }
  return userScores;
}

module.exports = { startGame, gameLogic };
