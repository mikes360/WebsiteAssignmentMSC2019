const controller = require('./controller');

function startGame(app, secondsUntillKickOff) {
	// this needs to be set from the database
	// get the upcoming game and set a timer to go off when the games all start

	//let game = await controller.getGame(app);

	if(secondsUntillKickOff == null){
		secondsUntillKickOff = 10;
		// get from game 
	}

	setTimeout(gameLogic, 1000 * secondsUntillKickOff, app);
}

async function gameLogic(app) {

	console.log("gameLogic - starting")
	// array to hold results
	let snitchCatchTime = getRandomInt(5, 30)
	let snitchCatchTeam = 1
	let matchResults = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]

	// build some results
	for (var i = 0; i < matchResults.length; i++) {
		matchResults[i][0] = createMatchScore(100, 300)
		matchResults[i][1] = createMatchScore(100, 300)
		matchResults[i][getRandomInt(0, 1)] += 150
	}

	// get users
	let users = await controller.getUsers(app)

	for (var i = 0; i < users.length; i++) {
		let user = users[i]

		if ( user.games[0].firstGoldenSnitchTeamPrediction == snitchCatchTeam) {
			user.games[0].totalScore += 50
		}
		
		if (user.games[0].firstGoldenSnitchTimePrediction == snitchCatchTime) {
			user.games[0].totalScore += 150
		}

	

		// calculate users scores
		let userMatchScores = getMatchScores(user, matchResults)

		for (var x = 0; x < userMatchScores.length; x++) {
			user.games[0].totalScore += userMatchScores[x]
		}

		// save the scores in the user json
		user.games[0].matchScores = userMatchScores
		user.games[0].matchResults = matchResults

		console.log('User ' + user.username + ' total score ' + user.games[0].totalScore)

		user = controller.prependNewGameData(user)

		await controller.updateUser(app, user)
	}
}

//calculates total score for a team in a match
function createMatchScore(min, max) {
	let score = getRandomInt(min, max);
	return score;
}

function getRandomInt(min, max) {
	return Math.floor((Math.random() * (max - min + 1) + min) / 10) * 10;
}

function getMatchScores(user, results) {
	let predictions = user.games[0].matchPredictions;

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
		if (
			result[0] === prediction[0] &&
			result[1] === prediction[1]
		) {
			matchScore += 10;
		}

		userScores[i] = matchScore;
	}
	return userScores;
}

module.exports = { startGame, gameLogic };
