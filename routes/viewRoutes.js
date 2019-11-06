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

				let team = await controller.getTeam(app, firstGoldenSnitchTeamPrediction);

				// flatten(by merging the arrays) userPredication into a single array

				let predictions = [];
				predictions = [].concat.apply(predictions, userPredictions);

				// set user prediction data

				meme.userPredictions = predictions;
				meme.firstGoldenSnitchTeamPredictionID = firstGoldenSnitchTeamPrediction;
				meme.firstGoldenSnitchTeamPredictionName = team.teamName;
				meme.firstGoldenSnitchTimePrediction = firstGoldenSnitchTimePrediction;

				// set user random user data as a test

				meme.userPredictions = [20, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				meme.firstGoldenSnitchTeamPredictionID = "1";
				meme.firstGoldenSnitchTeamPredictionName = "Kenmare Kestrels";
				meme.firstGoldenSnitchTimePrediction = 30;
				return res.render("matches", {
					loggedIn: true,
					title: "game week one",
					meme: meme
				});
			} else {
				//set base data

				meme.userPredictions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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

	router.get("/results", async (req, res) => {
		let username = authenticate.getUsername(req);
		if (username) {
			let user = await controller.getUser(app, username);

			// this will eventually be parsed from the user object
			// let predictions = user.gameData.predictions
			// let scores = [20, 0, 0, 0, 30, 20];
			// let total = 10;s

			let gameData = {
				predictions: user.games[1].matchPredictions,
				results: user.games[1].matchResults,
				scores: user.games[1].matchScores,
				total: user.games[1].totalScore
			};

			return res.render("results", {
				gameData: gameData
			});
		} else {
			res.redirect("/login");
		}
	});

	return router;
};
