const controller = require("./controller");

function startGame(app) {
  // this needs to be set from the database
  // get the upcoming game and set a timer to go off when the games all start

  //let game = await controller.getGame(app);

  setTimeout(gameLogic, 1000 * 10, app);
}

async function gameLogic(app) {
  // array to hold results
  let matchResults = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]

  // build some results
  for (var i = 0; i < matchResults.length; i++) {
    matchResults[i][0] = createMatchScore(100, 200)
    matchResults[i][1] = createMatchScore(100, 200)
  }

  // get users
  let users = await controller.getUsers(app);

  for (var i = 0; i < users.length; i++) {
    let user = users[i];

    // calculate users scores
    let userMatchScores = getMatchScores(user, matchResults)
    console.log("User " + user.username + " scores " + userMatchScores)

    // save the scores in the user json
    user.games[0].matchScores = userMatchScores
    user.games[0].matchResults = matchResults

    await controller.updateUser(app, user)
  }
}

function createMatchScore(min, max) {
  let score = getRandomInt(min, max);
  return score;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getMatchScores(user, results) {
  let predictions = user.games[0].matchPredictions

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
