const express = require('express');
const router = express.Router();

const controller = require('../controller');
const authenticate = require('../authenticate');
const gameModule = require("../game")

module.exports = app => {
	router.get('/logout', (req, res) => {
		authenticate.logout(res);
		res.redirect('/');
	});

	router.get('/login', async (req, res) =>
		authenticate.login(app, req, res)
	);

	router.post('/user', async (req, res) => {
		let nu = {
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			username: req.body.username,
			password: req.body.password,
			email: req.body.email
		};
		controller.addUser(app, nu, res);
	});

	router.post('/user/predictions', async (req, res) => {
		// 27-Oct-2019 - Mike Knight
		// This is a sample bit of code for ben to demo, how to reformat
		// the scores from the formData and store them in the database

		let username = authenticate.getUsername(req);
		if (username) {
			let formData = req.body;

			let formKeys = Object.keys(formData);
			let userPrediction = new Array(formKeys.length / 2 - 1);

			for (let i = 0; i < userPrediction.length; i++) {
				userPrediction[i] = [
					formData[formKeys[i * 2]],
					formData[formKeys[i * 2 + 1]]
				];
			}

			let user = await controller.getUser(app, username);
			user.games[0].matchPredictions = userPrediction;

			await controller.addUserPredictions(app, user);
			res.redirect('/');
		} else {
			res.redirect('/');
			console.info('Session ran out');
		}
	});

	// THESE ROUTES ARE ONLY FOR TESTING AND NOT PART
	// OF THE MAIN SITE

	router.get('/user', async (req, res) => {
		if (authenticate.isAuthenticated(req)) {
			let users = await controller.getUsers(app);
			return res.json(users);
		} else {
			res.status(404).send('Unauthorized');
		}
	});

	router.get('/team', async (req, res) => {
		let team = await controller.getTeams(app);
		return res.json(team);
	});

	router.get('/game', async (req, res) => {
		let game = await controller.getGame(app);
		return res.json(game);
	});

	router.get('/game/start', async (req, res) => {

		console.info('Starting game');
		gameModule.startGame(app, 1);
		return res.status(200).json("Game Started");
	});

	return router;
};
