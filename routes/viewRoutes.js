const express = require("express");
const router = express.Router();

const controller = require("../controller");
const authenticate = require("../authenticate");
const gameUtils = require("../gameUtils");

module.exports = app => {
	//Access main ejs page when clicking on Super6 button
	router.get("/", async (req, res) => {
		let meme = await controller.getGame(app);

		console.log("Username  " + authenticate.getUsername(req));
		console.log(meme)

		return res.render("main", {
			loggedIn: authenticate.isAuthenticated(req),
			bannerText: null,
			meme: meme[0]
		});
	});

	router.get("/logged-in", async (req, res) => {
		let meme = await controller.getGame(app);
		let username = authenticate.getUsername(req);
		console.log(meme)
		return res.render("main", {
			loggedIn: authenticate.isAuthenticated(req),
			bannerText: "Welcome " + username,
			meme: meme[0]
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

			if (gameUtils.isPredictionsAvailable(user)) {
				// get user predictions for team scores, snitch time and snitch team

				let userPredictions = user.games[0].matchPredictions;
				let firstGoldenSnitchTeamPrediction = user.games[0].firstGoldenSnitchTeamPrediction;
				let firstGoldenSnitchTimePrediction = user.games[0].firstGoldenSnitchTimePrediction;

				// get team name based on teamID from snitch team prediction

				let team = await controller.getTeam(app, parseInt(firstGoldenSnitchTeamPrediction));

				console.log(userPredictions);
				meme[0].userPredictions = userPredictions;
				meme[0].firstGoldenSnitchTeamPredictionID = firstGoldenSnitchTeamPrediction;
				meme[0].firstGoldenSnitchTimePrediction = firstGoldenSnitchTimePrediction;
				if (team) {
					meme[0].firstGoldenSnitchTeamPredictionName = team.teamName;
				} else {
					meme[0].firstGoldenSnitchTeamPredictionName = "Select a Team";
				}

				for(var i = 0; i < meme[0].matches.length; i++) {
					meme[0].matches[i][0].userPrediction = userPredictions[i][0];
					meme[0].matches[i][1].userPrediction = userPredictions[i][1];
				}


				console.log(meme);
				return res.render("matches", {
					loggedIn: true,
					title: "",
					meme: meme[0]
				});
			} else {
				//set base data
				for(var i = 0; i < meme[0].matches.length; i++) {
					meme[0].matches[0].userPrediction = '';
					meme[0].matches[1].userPrediction = '';
				}

				meme[0].userPredictions = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
				meme[0].firstGoldenSnitchTeamPredictionID = "base";
				meme[0].firstGoldenSnitchTeamPredictionName = "Select a team";
				meme[0].firstGoldenSnitchTimePrediction = 25;
				console.log(meme);
				return res.render("matches", {
					loggedIn: true,
					title: "",
					meme: meme[0]
				});
			}
		} else {
			res.redirect("/login");
		}
	});

	router.get("/live", async (req, res) => {
		//let results = liveGame.getResults();
		if(authenticate.isAuthenticated(req)) {

			let game = await controller.getGame(app);

			return res.render("live", {
				loggedIn: authenticate.isAuthenticated(req),
				title: "",
				meme: game[0],
			});
		}
		else {
			res.redirect("/login");
		}
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
			if (gameUtils.isResultsAvailable(user)) {
							
				let bob = await controller.getTeam(app, parseInt(user.games[1].firstGoldenSnitchTeamPrediction))
				if (bob) {
					game[1].firstGoldenSnitchTeamPredictionName = bob.teamName;
				} else {
					game[1].firstGoldenSnitchTeamPredictionName = "Select a Team";
				}

				let bob2 = await controller.getTeam(app, parseInt(user.games[1].firstGoldenSnitchTeamResult))
				game[1].firstGoldenSnitchTeamResult = bob2.teamName;

				game[1].firstGoldenSnitchTimePrediction = user.games[1].firstGoldenSnitchTimePrediction;
			
				game[1].firstGoldenSnitchTimeResult = user.games[1].firstGoldenSnitchTimeResult;

				game[1].totalScore = user.games[1].totalScore
				
				for (var i = 0; i < game[1].matches.length; i++) {
					game[1].matches[i][0].result = user.games[1].matchResults[i][0];
					game[1].matches[i][0].prediction = user.games[1].matchPredictions[i][0];

					game[1].matches[i][1].result = user.games[1].matchResults[i][1];
					game[1].matches[i][1].prediction = user.games[1].matchPredictions[i][1];

					game[1].matches[i].splice(0, 0, { score: user.games[1].matchScores[i] });
			
				}
				return res.render('results', {
					loggedIn: true,
					meme: game[1]
				});
			} else {
				return res.render('main', {
					loggedIn: true,
					meme: game[0],
					bannerText: "No predictions have been placed"
				});
			}
		} else {
			res.redirect("/login");
		}
	});

	router.get("/leaderboard", async (req, res) => {
		return res.render("leaderboard", {
		  loggedIn: authenticate.isAuthenticated(req)
		});
	});

	return router;
};
