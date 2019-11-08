const express = require("express");
const router = express.Router();

const controller = require("../controller");
const authenticate = require("../authenticate");
const liveGame = require("../liveGame");
const game = require("../game");

module.exports = app => {
	//Access main ejs page when clicking on Super6 button
	router.get("/", async (req, res) => {
		let meme = await controller.getGame(app);

		console.log("Username  " + authenticate.getUsername(req));

		return res.render("main", {
			loggedIn: authenticate.isAuthenticated(req),
			meme: meme
		});
	});

	router.get("/login", async (req, res) => {
		return res.render("login", {
			loggedIn: false
		});
	});

	// Updatted matches route - will now get user predictions if user predictions have been set before.
	router.get("/matches", async (req, res) => {
		if (authenticate.isAuthenticated(req)) {
			let meme = await controller.getGame(app);
			let username = authenticate.getUsername(req);
			let user = await controller.getUser(app, username);

			// condition to check whether predictions have been set

			if (game.isPredictionsAvailable(user)) {
				// get user predictions for team scores, snitch time and snitch team

				let userPredictions = user.games[0].matchPredictions;
				let firstGoldenSnitchTeamPrediction = user.games[0].firstGoldenSnitchTeamPrediction;
				let firstGoldenSnitchTimePrediction = user.games[0].firstGoldenSnitchTimePrediction;

				// get team name based on teamID from snitch team prediction

				let team = await controller.getTeam(app, parseInt(firstGoldenSnitchTeamPrediction));

				console.log(userPredictions);
				meme.userPredictions = userPredictions;
				meme.firstGoldenSnitchTeamPredictionID = firstGoldenSnitchTeamPrediction;
				meme.firstGoldenSnitchTimePrediction = firstGoldenSnitchTimePrediction;
				if (team) {
					meme.firstGoldenSnitchTeamPredictionName = team.teamName;
				} else {
					meme.firstGoldenSnitchTeamPredictionName = "Select a Team";
				}

				for(var i = 0; i < meme[0].matches.length; i++) {
					meme[0].matches[i][0].userPrediction = userPredictions[i][0];
					meme[0].matches[i][1].userPrediction = userPredictions[i][1];
				}


				console.log(meme);
				return res.render("matches", {
					loggedIn: true,
					title: "game week one",
					meme: meme
				});
			} else {
				//set base data
				for(var i = 0; i < meme[0].matches.length; i++) {
					meme[0].matches[0].userPrediction = '';
					meme[0].matches[1].userPrediction = '';
				}

				meme.userPredictions = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
				meme.firstGoldenSnitchTeamPredictionID = "base";
				meme.firstGoldenSnitchTeamPredictionName = "Select a team";
				meme.firstGoldenSnitchTimePrediction = 25;
				console.log(meme);
				return res.render("matches", {
					loggedIn: true,
					title: "game week one",
					meme: meme
				});
			}
		} else {
			res.redirect("/login");
		}
	});

	router.get("/live", async (req, res) => {
		let results = liveGame.getResults();
		let game = await controller.getGame(app);

		for (var i = 0; i < game[0].matches.length; i++) {
			game[0].matches[i][0].score = results[i][0];
			game[0].matches[i][1].score = results[i][1];
		}

		console.log("results " + results);

		return res.render("live", {
			loggedIn: authenticate.isAuthenticated(req),
			title: "live view",
			meme: game,
			results: results
		});
		//return res.json(results);
	});

	//Access register (ejs) page from home page
	router.get("/register", async (req, res) => {
		let nu = {
			firstname: "",
			lastname: "",
			username: "",
			password: "",
			email: ""
		};
		return res.render("register", {
			loggedIn: false,
			firstnameerror: "",
			lastnameerror: "",
			usernameerror: "",
			passworderror: "",
			emailerror: "",
			user: nu
		});
	});

	router.get('/results', async (req, res) => {
		let username = authenticate.getUsername(req)
		if (username) {
			let user = await controller.getUser(app, username);
			let game = await controller.getGame(app);
			
			let bob = await controller.getTeam(app, parseInt(user.games[1].firstGoldenSnitchTeamPrediction))
			game[1].firstGoldenSnitchTeamPrediction = bob.teamName;

			let bob2 = await controller.getTeam(app, parseInt(user.games[1].firstGoldenSnitchTeamResult))
			game[1].firstGoldenSnitchTeamResult = bob2.teamName;

			game[1].totalScore = user.games[1].totalScore
						

			for (var i = 0; i < game[1].matches.length; i++) {
			game[1].matches[i][0].result = user.games[1].matchResults[i][0];
			game[1].matches[i][0].prediction = user.games[1].matchPredictions[i][0];

			game[1].matches[i][1].result = user.games[1].matchResults[i][1];
			game[1].matches[i][1].prediction = user.games[1].matchPredictions[i][1];

			game[1].matches[i].splice(0, 0, { score: user.games[1].matchScores[i] });
			
			//let firstGoldenSnitchTimePrediction = user.games[0].firstGoldenSnitchTimePrediction;
		}
			return res.render('results', {
				loggedIn: true,
				meme: game[1]
			});
		} else {
			res.redirect("/login");
		}
	});

	return router;
};
