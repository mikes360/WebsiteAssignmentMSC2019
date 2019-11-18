
const gameUtils = require("./gameUtils");
const controller = require("./controller");

let matchResults = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
let running = false;

let SIMULATION_TIME = 120
let UPDATE_INTERVAL_SECONDS = 2


// how many times the game logic will execute for counting purposes
let SIMULATION_EXECUTION_COUNT = SIMULATION_TIME / UPDATE_INTERVAL_SECONDS

let currentSimulationCount = 0;

function startGame(app) {
  if(!running){
    setTimeout(gameLogic, 1000 * UPDATE_INTERVAL_SECONDS, app);
    running = true;
  }
}

function isRunning() {
  return running;
}


async function getResults(app, username) {
    let user = await controller.getUser(app, username);

    let game = {};
    if(user) {
      game = user.games[0];
      game.matchResults = matchResults;
      game = gameUtils.getCurrentUserScores(game, matchResults, -1, -1);
    }
    return game;
}

function gameLogic(app) {
    for (var i = 0; i < matchResults.length; i++) {
		matchResults[i][0] += getRandomInt(0, 20)
		matchResults[i][1] += getRandomInt(0, 20)
    }
    
    currentSimulationCount++;
    console.log("Simulation count " + currentSimulationCount)

    if(currentSimulationCount < SIMULATION_EXECUTION_COUNT) {
      setTimeout(gameLogic, 1000 * UPDATE_INTERVAL_SECONDS, app);
    }
    else {
      console.log("Simulation ended")
    }


    //console.log('Current match scores ' + matchResults)  
}

function getRandomInt(min, max) {
	return Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
}

module.exports = { startGame, isRunning, getResults };