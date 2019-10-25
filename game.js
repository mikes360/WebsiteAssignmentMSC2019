const controller = require("./controller");

function startGame(app) {
  // this needs to be set from the database
  // get the upcoming game and set a timer to go off when the games all start

  //let game = await controller.getGame(app);

  setTimeout(gameLogic, 1000 * 10, app);
}

async function gameLogic(app) {
  // array to hold results
  let results = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

  // build some results
  for (var i = 0; i < results.length; i++) {
    results[i][0] = createMatchScore(100, 200);
    results[i][1] = createMatchScore(100, 200);
  }

  // get users
  let users = await controller.getUsers(app);

  for (var i = 0; i < users.length; i++) {
    let user = users[i];

    // calculate users scores
    let userScores = getUserScores(user, results);
    console.log("User " + user.username + " scores " + userScores);

    // TODO: store them in the user object
    // user.grandtotal += score[0] + score[1]
    // user.grandTotal += snitchTimeScore
    // user.gamedata[2].results = results
    // user.gamedata[id].scores = userScores
    // await controller.updateUser(app, user)
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

function getUserScores(user, results) {
  let predictions = getUserPredictions(user);

  // loop round the results and calculate score for each match based on a point system
  let userScores = [0, 0, 0, 0, 0, 0];

  for (var i = 0; i < predictions.length; i++) {
    let matchScore = 0; // calculate score
    let prediction = predictions[i]; // [160, 200]
    let result = results[i]; // [160, 200]

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

function getUserPredictions(user) {
  // user.gamedata[0].predictions;
  let results = [[10, 20], [30, 40], [50, 60], [70, 80], [90, 100], [110, 120]];
}

module.exports = { startGame, gameLogic };
