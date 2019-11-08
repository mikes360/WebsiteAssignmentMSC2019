const controller = require("./controller");
const gameUtils = require("./gameUtils");

const MIN_MATCH_SCORE = 100;
const MAX_MATCH_SCORE = 300;
const SNITCH_CATCH_POINTS = 150;

function startGame(app, secondsUntillKickOff) {
	//let game = await controller.getGame(app);

	if (secondsUntillKickOff == null) {
		secondsUntillKickOff = 10;
		// get from game
	}

	setTimeout(gameLogic, 1000 * secondsUntillKickOff, app);
}

async function gameLogic(app) {
	console.log("gameLogic - starting");

	let game = await controller.getGame(app);

	let snitchCatchTeam = 0;
	let snitchCatchTime = getRandomInt(10, 100);
	let matchResults = new Array(game[0].matches.length);

	// this holds the team id from every match that caught the snitch
	// the first team to catch the snitch is randomly chosen from this array
	let snitchTeams = new Array(game[0].matches.length);

	// build some results
	for (var i = 0; i < matchResults.length; i++) {
		let team0SkillAdvantage = game[0].matches[i][0].skill;
		let team1SkillAdvantage = game[0].matches[i][1].skill;

		matchResults[i] = new Array(2);
		matchResults[i][0] = createMatchScore(MIN_MATCH_SCORE, MAX_MATCH_SCORE, team0SkillAdvantage);
		matchResults[i][1] = createMatchScore(MIN_MATCH_SCORE, MAX_MATCH_SCORE, team1SkillAdvantage);

		let catchIndex = getRandomInt(0, 1);
		matchResults[i][catchIndex] += SNITCH_CATCH_POINTS;
		snitchTeams[i] = game[0].matches[i][catchIndex].teamID;
	}

	snitchCatchTeam = snitchTeams[getRandomInt(0, snitchTeams.length)];

	console.log("***** Game Complete ****");
	console.log("* Match results " + matchResults);
	console.log("* Teams who caught the snitch " + snitchTeams);
	console.log("* First team to catch the snitch " + snitchCatchTeam);
	console.log("* Time the first team caught the snitch " + snitchCatchTime);

	let users = await controller.getUsers(app);

	for (var i = 0; i < users.length; i++) {
		let user = users[i];

		user.games[0] = gameUtils.getCurrentUserScores(user.games[0], matchResults, snitchCatchTeam, snitchCatchTime)

		user.grandTotal += user.games[0].totalScore;
		user.games[0].matchResults = matchResults;
		user.games[0].firstGoldenSnitchTeamResult = snitchCatchTeam;
		user.games[0].firstGoldenSnitchTimeResult = snitchCatchTime;

		console.log("User " + user.username + " total score " + user.games[0].totalScore);

		user = controller.prependNewGameData(user);

		await controller.updateUser(app, user);
	}
}

function isPredictionsAvailable(user) {
	// if the first match of the game has a value greater than -1 they have submitted some predictions.
	return user.games[0].matchPredictions[0][0] > -1;
}

//calculates total score for a team in a match
function createMatchScore(min, max, multiplier) {
	let score = Math.floor(((Math.random() + multiplier) * (max - min) + min) / 10) * 10;
	return score;
}

function getRandomInt(min, max) {
	let result = Math.round(Math.random() * (max - min) + min);
	return result;
}

module.exports = { startGame, gameLogic, isPredictionsAvailable };
