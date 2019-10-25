let DB_URL = 'mongodb://localhost:27017';
let DB_NAME = 'quidditch';
let DB_ALIAS = 'myDb';

const MongoClient = require('mongodb').MongoClient;

//connection to the user database
async function connect(app) {
	MongoClient.connect(
		DB_URL,
		{ useNewUrlParser: true, useUnifiedTopology: true },
		(err, client) => {
			app.set(DB_ALIAS, client.db(DB_NAME));
		}
	);
}

async function getUsers(app) {
  return app
    .set(DB_ALIAS)
    .collection("users")
    .find({})
    .toArray();
}

async function getUser(app, name) {
  return app
    .set(DB_ALIAS)
    .collection("users")
    .findOne({ username: name });
}

async function addUser(app, nu, res) {
  let firstnameerror = "";
  let lastnameerror = "";
  let usernameerror = "";
  let passworderror = "";
  let emailerror = "";

  if (nu.firstname === "") {
    firstnameerror = "*First name is required";
  }

  if (nu.lastname === "") {
    lastnameerror = "*Last name is required";
  }

  if (nu.username === "") {
    usernameerror = "*Username is required";
  }

  if (nu.password === "") {
    passworderror = "*Password is required";
  }

  if (nu.email === "") {
    emailerror = "*Email is required";
  }

  if (
    firstnameerror === "" &&
    lastnameerror === "" &&
    usernameerror === "" &&
    passworderror === "" &&
    emailerror === ""
  ) {
    //insert code here that validation has passed
    const db = app.get(DB_ALIAS);
    const collection = db.collection("users");
    collection.insertOne(nu, function(err, result) {
      if (err != null) {
        console.log(err);
        res.status(200).send("<p>Fail</p>");
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.render("register", {
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

//Add user Predictions

async function addUserPredictions(app, up, res) {
	if (up === '') {
		res.status(200).render('/', {
			loggedIn: true,
			error: 'no scores submitted'
		});
		return false;
	}

	const db = app.get(DB_ALIAS);
	const collection = db.collection('users');
	collection.findOneAndUpdate({ username: 'ben' }, up, function(
		err,
		res
	) {
		if (err != null) {
			console.log(err);
			//res.status(200).send('<p>Fail</p>');
		} else {
		}
	});
}

async function getTeams(app) {
  return app
    .set(DB_ALIAS)
    .collection("team")
    .find({})
    .toArray();
}

async function getGame(app) {
  let game = await app
    .set(DB_ALIAS)
    .collection("game")
    .find({})
    .toArray();
  let teams = await getTeams(app);

	for (var i = 0; i < game[0].matches.length; i++) {
		game[0].matches[i][0] = findTeam(teams, game[0].matches[i][0]);
		game[0].matches[i][1] = findTeam(teams, game[0].matches[i][1]);
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
	connect,
	getUsers,
	getUser,
	addUser,
	getTeams,
	getGame,
	addUserPredictions
};
