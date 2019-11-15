const express = require("express");
const router = express.Router();

const controller = require("../controller");
const authenticate = require("../authenticate");
const gameModule = require("../game");
const liveGame = require("../liveGame");

const FIRST_GOLDEN_SNITCH_TEAM_PREDICTION = "firstGoldenSnitchTeamPrediction";
const FIRST_GOLDEN_SNITCH_TIME_PREDICTION = "firstGoldenSnitchTimePrediction";

module.exports = app => {
	router.get("/logout", (req, res) => {
		authenticate.logout(res);
		res.redirect("/");
	});

	router.get("/login", async (req, res) => authenticate.login(app, req, res));

	router.post("/user", async (req, res) => {
		let nu = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		};
		controller.addUser(app, nu, res);
	});

	// Post User Predictions - posts all ofthe form data

	router.post("/user/predictions", async (req, res) => {
		let username = authenticate.getUsername(req);
		if (username) {
			let formData = req.body;

			let formKeys = Object.keys(formData);
			formKeys = formKeys.filter(key => key !== FIRST_GOLDEN_SNITCH_TEAM_PREDICTION && key !== FIRST_GOLDEN_SNITCH_TIME_PREDICTION);

			let userPrediction = new Array(formKeys.length / 2);
			for (let i = 0; i < userPrediction.length; i++) {
				userPrediction[i] = [formData[formKeys[i * 2]], formData[formKeys[i * 2 + 1]]];
			}

			let games = await controller.getGame(app);
			let user = await controller.getUser(app, username);

			user.games[0].gameID = games[0].gameID;
			user.games[0].matchPredictions = userPrediction;

			// set snitch form data

			user.games[0].firstGoldenSnitchTeamPrediction = formData.firstGoldenSnitchTeamPrediction;
			user.games[0].firstGoldenSnitchTimePrediction = formData.firstGoldenSnitchTimePrediction;

			await controller.updateUser(app, user);
			res.redirect("/");
		} else {
			res.redirect("/");
			console.info("Session ran out");
		}
	});

	// THESE ROUTES ARE ONLY FOR TESTING AND NOT PART OF THE MAIN SITE

	router.get("/user", async (req, res) => {
		if (authenticate.isAuthenticated(req)) {
			let users = await controller.getUsers(app);
			return res.json(users);
		} else {
			res.status(404).send("Unauthorized");
		}
	});

	router.get("/team", async (req, res) => {
		let team = await controller.getTeams(app);
		return res.json(team);
	});

	router.get("/game", async (req, res) => {
		let game = await controller.getGame(app);
		return res.json(game);
	});

	router.get("/game/start", async (req, res) => {
		console.info("Starting game");
		liveGame.startGame(app);
		//gameModule.startGame(app, 1);
		return res.status(200).json("Game Started");
	});


	router.get("/game/live", async (req, res) => {

		let username = authenticate.getUsername(req);
		if(username) {
			if(liveGame.isRunning()) {
				let results = await liveGame.getResults(app, username)
				return res.json(results);
			}
			else {
				res.json("Game Not Started");
			}			
		}
		else {
			res.status(404).json("Unauthorized");
		}
	});

	router.get("/game/live/lockscore", async (req, res) => {
		//let game = await controller.getGame(app);
		console.info("Score locked in");
		return res.status(200).json("Score locked in");		
	});

	return router;
};
