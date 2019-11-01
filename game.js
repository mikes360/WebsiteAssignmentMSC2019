const controller = require('./controller');

const MATCH_SCORE_POINTS = 10
const TEAM_SCORE_POINTS = 50
const TIME_SCORE_POINTS = 150

function startGame(app, secondsUntillKickOff) {
	//let game = await controller.getGame(app);

	if(secondsUntillKickOff == null){
		secondsUntillKickOff = 10;
		// get from game 
	}

	setTimeout(gameLogic, 1000 * secondsUntillKickOff, app);
}

async function gameLogic(app) {

	console.log("gameLogic - starting")

	let game = await controller.getGame(app)

	let snitchCatchTeam = 0
	let snitchCatchTime = getRandomInt(10, 100)
	let matchResults = new Array(game[0].matches.length)

	// this holds the team id from every match that caught the snitch
	// the first team to catch the snitch is randomly chosen from this array
	let snitchTeams = new Array(game[0].matches.length)

	// build some results
	for (var i = 0; i < matchResults.length; i++) {
		matchResults[i] = new Array(2)
		matchResults[i][0] = createMatchScore(100, 300)
		matchResults[i][1] = createMatchScore(100, 300)

		let catchIndex = getRandomInt(0, 1)
		matchResults[i][catchIndex] += 150
		snitchTeams[i] = game[0].matches[i][catchIndex].teamID
	}

	snitchCatchTeam = snitchTeams[getRandomInt(0, game[0].matches.length)]

	console.log('***** Game Complete ****')
	console.log('* Match results ' + matchResults)
	console.log('* Teams who caught the snitch ' + snitchTeams)
	console.log('* First team to catch the snitch ' + snitchCatchTeam)
	console.log('* Time the first team caught the snitch ' + snitchCatchTime)

	let users = await controller.getUsers(app)

	for (var i = 0; i < users.length; i++) {
		let user = users[i]

		if( isPredictionsAvailable(user) ) {
			// calculate users scores for each match prediction and add to total
			let userMatchScores = getMatchScores(user, matchResults)

			for (var x = 0; x < userMatchScores.length; x++) {
				user.games[0].totalScore += userMatchScores[x]
			}

			// if the team prediction is correct add more points to total
			if ( user.games[0].firstGoldenSnitchTeamPrediction == snitchCatchTeam) {
				user.games[0].totalScore += TEAM_SCORE_POINTS
			}

			// if the time prediction is correct add more points to total
			if (user.games[0].firstGoldenSnitchTimePrediction == snitchCatchTime) {
				user.games[0].totalScore += TIME_SCORE_POINTS
			}

			// save the scores in the user json
			user.games[0].matchScores = userMatchScores

		}
		user.grandTotal += user.games[0].totalScore;
		user.games[0].matchResults = matchResults
		user.games[0].firstGoldenSnitchTeamResult = snitchCatchTeam
		user.games[0].firstGoldenSnitchTimeResult = snitchCatchTime

		console.log('User ' + user.username + ' total score ' + user.games[0].totalScore)

		user = controller.prependNewGameData(user)

		await controller.updateUser(app, user)
	}
}

function isPredictionsAvailable(user) {
	// if the first match of the game has a value greater than -1 they have submitted some predictions.
	return user.games[0].matchPredictions[0][0] > -1 
}


//calculates total score for a team in a match
function createMatchScore(min, max) {
	let score = Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
	return score;
}



function getRandomInt(min, max) {
	let result = Math.round(Math.random() * (max - min) + min)
	return result
}

function getMatchScores(user, results) {
	let predictions = user.games[0].matchPredictions;

	// loop round the results and calculate score for each match based on a point system
	let userScores = [0, 0, 0, 0, 0, 0];

	for (var i = 0; i < predictions.length; i++) {

		let matchScore = 0; 
		let prediction = predictions[i];
		let result = results[i];

		if (result[0] === prediction[0]) {
			matchScore += MATCH_SCORE_POINTS;
		}
		if (result[1] === prediction[1]) {
			matchScore += MATCH_SCORE_POINTS;
		}
		if (result[0] === prediction[0] && result[1] === prediction[1]) {
			matchScore += MATCH_SCORE_POINTS;
		}

		userScores[i] = matchScore;
	}
	return userScores;
}

module.exports = { startGame, gameLogic };
