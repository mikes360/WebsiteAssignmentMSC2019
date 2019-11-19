
const gameUtils = require("./gameUtils");
const controller = require("./controller");

let snitchTeams = null; // teams who caught the snitch
let snitchTimes = null; // times the teams caught the snitch, accending order
let matchResults = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
let running = false;
let currentSimulationCount = 0;

let SIMULATION_TIME = 120
let UPDATE_INTERVAL_SECONDS = 2

let REAL_TIME_DURATION_MINUTES = 250; // how long the game lasts in real time

// how many times the game logic will execute for counting purposes
let SIMULATION_EXECUTION_COUNT = SIMULATION_TIME / UPDATE_INTERVAL_SECONDS

async function startGame(app) {
  if(!running){
    await calculateSnitchTeamsAndTimes(app);
    setTimeout(gameLogic, 1000 * UPDATE_INTERVAL_SECONDS, app);
    running = true;
  }
}

function isRunning() {
  return running;
}

async function getResultsByUsername(app, username) {
  let user = await controller.getUser(app, username);
  return await getResults(user);
}

async function getResults(user) {

    let game = {};
    if(user) {
      game = user.games[0];
      game.matchResults = matchResults;

      if( isSnitchCaught(snitchTimes[0])) {
        game.firstGoldenSnitchTeamResult = snitchTeams[0]
        game.firstGoldenSnitchTimeResult = snitchTimes[0]
      }

      if(!game.lockedIn) {
        game = gameUtils.appendCurrentUserScores(game);
      }
    }
    return game;
}

async function calculateSnitchTeamsAndTimes(app) {
  
  let games = await controller.getGame(app);

  snitchTeams = new Array(games[0].matches.length);
  snitchTimes = new Array(games[0].matches.length);

  for(var i = 0; i < games[0].matches.length; i++) {

    snitchTimes[i] = getRandomInt(25, REAL_TIME_DURATION_MINUTES);

    let catchIndex = getRandomInt(0, 1);
    snitchTeams[i] = games[0].matches[i][catchIndex].teamID;
  }

  snitchTeams = shuffle(snitchTeams);
  snitchTimes.sort((a, b) => {return a-b} );

  console.log("***** Calculated results ****");
	console.log("* Teams who caught the snitch " + snitchTeams);
	console.log("* Times for snitch being caught " + snitchTimes);
}

function isSnitchCaught(time) {
  
  let caught = false;
  let timeSlice = REAL_TIME_DURATION_MINUTES / SIMULATION_EXECUTION_COUNT

  if(time <= timeSlice * currentSimulationCount) {
    caught = true;
  }
  return caught;
}


async function gameLogic(app) {

    let games = await controller.getGame(app);

    for (var i = 0; i < matchResults.length; i++) {
      let team0SkillAdvantage = games[0].matches[i][0].skill;
      let team1SkillAdvantage = games[0].matches[i][1].skill;

		  matchResults[i][0] += createMatchScore(0, 20, team0SkillAdvantage)
		  matchResults[i][1] += createMatchScore(0, 20, team1SkillAdvantage)
    }

    console.log("* Current scores " + matchResults);
    
    currentSimulationCount++;
   // console.log("Simulation count " + currentSimulationCount)

    if(currentSimulationCount < SIMULATION_EXECUTION_COUNT) {
      setTimeout(gameLogic, 1000 * UPDATE_INTERVAL_SECONDS, app);
    }
    else {
      console.log("Simulation ended");
      let users = await controller.getUsers(app);

	    for (var i = 0; i < users.length; i++) {

        let user = users[i];
        let results = await getResults(user);
        user.games[0] = results;
		    user.grandTotal += user.games[0].totalScore;

		    console.log("User " + user.username + " total score " + user.games[0].totalScore);

		    user = controller.prependNewGameData(user);
		    await controller.updateUser(app, user);
      }
    }
}

function createMatchScore(min, max, multiplier) {
	let score = Math.floor(((Math.random() + multiplier) * (max - min) + min) / 10) * 10;
	return score;
}

function getRandomInt(min, max) {
	let result = Math.round(Math.random() * (max - min) + min);
	return result;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = { startGame, isRunning, getResultsByUsername,  };