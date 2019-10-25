const controller = require("./controller");

function startGame(app) {
  // this needs to be set from the database
  // get the upcoming game and set a timer to go off when the games all start

  //let game = await controller.getGame(app);

  setTimeout(gameLogic, 1000 * 10, app);
}

async function gameLogic(app) {
  let users = await controller.getUsers(app);
  let game = await controller.getGame(app);

  // create random scores
  var createWeightedScores = function(min_score, max_score, weight, rand, getTeamSkill) {
    let min_score = 0;
    let max_score = 100;
    let snitch_points = 150;
    //team with more skill likely to catch snitch, adds 150 to team score
    let weight = teamSkill;
    //skill number is already in teams DB array, and will 'weight' the random scores
    //so that a higher skilled team is likely to score higher

    //generates random number between min_score and max_score in multiples of 10 as per
    //quidditch points scoring system
    var rand = function(min_score, max_score) {
      return Math.floor(Math.round((Math.random() * (max_score - min_score + 1)) / 10) * 10);
    };

    //gets the skill number/weight from both teams that will be in a match
    //skill number is a decimal number between 0 and 1
    var teamSkill = function getTeamSkill(app, skill) {
      let DB_ALIAS = "myDb";
      return app
        .set(DB_ALIAS)
        .collection("team")
        .findOne({ skill });
    };

    //multiply skill number/weight by random score, rounded to multiples of 10
    var weightedScore = Math.round(((rand * teamSkill) / 10) * 10);

    //to weightedScore, snitch points are added randomly but more probably to higher
    //skilled team
    

    //for team in match
    match[0].team1.createWeightedScores(weightedScore);
    match[0].team2.createWeightedScores(weightedScore);

    //and then map the createWeightedScore to the match table online?
  };

  console.log("gameLogic - Executed");
}

module.exports = { startGame, gameLogic };
