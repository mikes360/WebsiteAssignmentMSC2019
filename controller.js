let DB_URL = 'mongodb://localhost:27017';
let DB_NAME = 'quidditch';
let DB_ALIAS = 'myDb';

let TEAM_COLLECTION = 'team';
let GAME_COLLECTION = 'game';
let USERS_COLLECTION = 'users';

const MongoClient = require('mongodb').MongoClient;

//connection to the database
async function connect(app) {
	return new Promise(function(resolve) {
		MongoClient.connect(
			DB_URL,
			{ useNewUrlParser: true, useUnifiedTopology: true },
			(err, client) => {
				if (err) {
					resolve(false);
				} else {
					app.set(DB_ALIAS, client.db(DB_NAME));
					resolve(true);
				}
			}
		);
	});
}

async function getUsers(app) {
	return app.set(DB_ALIAS)
		.collection(USERS_COLLECTION)
		.find({})
		.toArray();
}

async function getUser(app, username) {
	return app
		.set(DB_ALIAS)
		.collection(USERS_COLLECTION)
		.findOne({ username: username });
}

async function updateUser(app, user) {
	return app
		.set(DB_ALIAS)
		.collection(USERS_COLLECTION)
		.replaceOne({ username: user.username }, user, function(err, result) {
			if (err) {
				console.log(err);
			}
		});
}

async function getTeams(app) {
	return app
		.set(DB_ALIAS)
		.collection(TEAM_COLLECTION)
		.find({})
		.toArray();
}

async function getTeam(app, id) {
	return app
		.set(DB_ALIAS)
		.collection(TEAM_COLLECTION)
		.findOne({ teamID: id });
}


async function addUser(app, nu, res) {
	let meme = await getGame(app);
	let firstnameerror = '';
	let lastnameerror = '';
	let usernameerror = '';
	let passworderror = '';
	let emailerror = '';

	if (nu.firstname === '') {
		firstnameerror = '*First name is required';
	}

	if (nu.lastname === '') {
		lastnameerror = '*Last name is required';
	}

	if (nu.username === '') {
		usernameerror = '*Username is required';
	}

	if (nu.password === '') {
		passworderror = '*Password is required';
	}

	if (nu.email === '') {
		emailerror = '*Email is required';
	}

	if (
		firstnameerror === '' &&
		lastnameerror === '' &&
		usernameerror === '' &&
		passworderror === '' &&
		emailerror === ''
	) {
		nu.grandTotal = 0;
		nu.games = new Array(0);
		nu = prependNewGameData(nu);

		//insert code here that validation has passed
		const db = app.get(DB_ALIAS);
		const collection = db.collection(USERS_COLLECTION);
		collection.insertOne(nu, function(err, result) {
			if (err != null) {
				console.log(err);
				res.status(200).send('<p>Fail</p>');
			} else {
				res.render('main', {
					loggedIn: false,
					meme: meme[0],
					flashRegister: 1,
					flashScores: 0,
					flashLogged: 0,
					flashResults: 0,
				});
			}
		});
	} else {
		res.render('register', {
			loggedIn: false,
			firstnameerror: firstnameerror,
			lastnameerror: lastnameerror,
			usernameerror: usernameerror,
			passworderror: passworderror,
			emailerror: emailerror,
			user: nu
		});
		return false;
	}
}

function prependNewGameData(user) {
	let defaultGameData = {
		gameID: -1,
		matchPredictions: [[-1, -1], [-1, -1], [-1, -1] ,[-1, -1], [-1, -1], [-1, -1]],
		firstGoldenSnitchTeamPrediction: -1,
		firstGoldenSnitchTimePrediction: -1,

		matchResults: [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]],
		matchScores: [-1, -1, -1, -1, -1, -1],
		firstGoldenSnitchTeamResult: -1,
		firstGoldenSnitchTimeResult: -1,
		totalScore: 0
	};

	user.games.splice(0, 0, defaultGameData)
	return user;
}

async function initialiseCollection(app, name, data) {
	let collection = await app.get(DB_ALIAS).collection(name);
	await collection.deleteMany({});
	await collection.insertMany(data);
}

async function getGame(app) {
	let game = await app.set(DB_ALIAS).collection(GAME_COLLECTION).find({}).toArray();
	let teams = await getTeams(app);

	for (var i = 0; i < game[0].matches.length; i++) {
		game[0].matches[i][0] = findTeam(teams, game[0].matches[i][0]);
		game[0].matches[i][1] = findTeam(teams, game[0].matches[i][1]);
	}
	
	for (var i = 0; i < game[1].matches.length; i++) {
		game[1].matches[i][0] = findTeam(teams, game[1].matches[i][0]);
		game[1].matches[i][1] = findTeam(teams, game[1].matches[i][1]);
	}
	return game;
}

function findTeam(teams, id) {
	for (var i = 0; i < teams.length; i++) {
		if (teams[i].teamID === id) {
			return teams[i];
		}
	}
}

module.exports = {
	GAME_COLLECTION: GAME_COLLECTION,
	USERS_COLLECTION: USERS_COLLECTION,
	TEAM_COLLECTION: TEAM_COLLECTION,

	connect,
	getUsers,
	getUser,
	addUser,
	getTeams,
	getTeam,
	getGame,
	updateUser,
	initialiseCollection,
	prependNewGameData
};
