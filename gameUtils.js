const MATCH_SCORE_POINTS = 10;
const TEAM_SCORE_POINTS = 50;
const TIME_SCORE_POINTS = 150;

function appendCurrentUserScores(game) {

	if (game.matchPredictions[0][0] > -1) {

		let userMatchScores = getMatchScores(game.matchPredictions, game.matchResults); 

		for (var x = 0; x < userMatchScores.length; x++) {
			game.totalScore += userMatchScores[x];
		}

		// if the team prediction is correct add more points to total
		if (game.firstGoldenSnitchTeamResult != -1 && game.firstGoldenSnitchTeamPrediction == game.firstGoldenSnitchTeamResult ) {
			game.totalScore += TEAM_SCORE_POINTS;
		}

		// if the time prediction is correct add more points to total
		if (game.firstGoldenSnitchTimeResult != -1 && game.firstGoldenSnitchTimePrediction == game.firstGoldenSnitchTimeResult) {
			game.totalScore += TIME_SCORE_POINTS;
		}

		// save the scores in the user json
		game.matchScores = userMatchScores;
	}
	return game;
}

function isPredictionsAvailable(user) {
	// if the first match of the game has a value greater than -1 they have submitted some predictions.
	return user.games[0].matchPredictions[0][0] > -1;
}

function getMatchScores(predictions, results) {

	// loop round the results and calculate score for each match based on a point system
	let userScores = [0, 0, 0, 0, 0, 0];

	for (var i = 0; i < predictions.length; i++) {
		let matchScore = 0;
		let prediction = predictions[i];
		let result = results[i];

		if (result[0] == prediction[0]) {
			matchScore += MATCH_SCORE_POINTS;
		}
		if (result[1] == prediction[1]) {
			matchScore += MATCH_SCORE_POINTS;
		}
		if (result[0] == prediction[0] && result[1] == prediction[1]) {
			matchScore += MATCH_SCORE_POINTS;
		}

		let resultTeam0Won = result[0] > result[1];
		let resultTeam1Won = result[0] < result[1];
		let resultDraw = result[0] == result[1];

		let userPredictsTeam0Won = prediction[0] > prediction[1];
		let userPredictsTeam1Won = prediction[0] < prediction[1];
		let userPredictsDraw = prediction[0] == prediction[1];

		if (resultTeam0Won && userPredictsTeam0Won) {
			matchScore += MATCH_SCORE_POINTS;
		} else if (resultTeam1Won && userPredictsTeam1Won) {
			matchScore += MATCH_SCORE_POINTS;
		} else if (resultDraw && userPredictsDraw) {
			matchScore += MATCH_SCORE_POINTS;
		}

		userScores[i] = matchScore;
	}
	return userScores;
}

module.exports = { appendCurrentUserScores, isPredictionsAvailable };