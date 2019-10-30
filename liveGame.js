
let matchResults = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]

let UPDATE_INTERVAL_SECONDS = 2

function startGame(app) {
	setTimeout(gameLogic, 1000 * UPDATE_INTERVAL_SECONDS, app);
}

function getResults() {
    return matchResults
}

async function gameLogic(app) {
    for (var i = 0; i < matchResults.length; i++) {
		matchResults[i][0] += getRandomInt(0, 20)
		matchResults[i][1] += getRandomInt(0, 20)
    }
    
    //console.log('Current match scores ' + matchResults)
    setTimeout(gameLogic, 1000 * UPDATE_INTERVAL_SECONDS, app);
}

function getRandomInt(min, max) {
	return Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
}

module.exports = { startGame, getResults };