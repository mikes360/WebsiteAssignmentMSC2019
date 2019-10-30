const express = require("express");
const router = express.Router();

const controller = require("./controller");
const authenticate = require("./authenticate");
const liveGame = require("./liveGame");

module.exports = app => {
  router.get("/api/logout", (req, res) => {
    authenticate.logout(res);
    res.redirect("/");
  });

  router.get("/api/login", async (req, res) => authenticate.login(app, req, res));

  router.post("/api/user", async (req, res) => {
    let nu = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    };
    controller.addUser(app, nu, res);
  });

    router.post('/api/user/predictions', async (req, res) => {
		// 27-Oct-2019 - Mike Knight
		// This is a sample bit of code for ben to demo, how to reformat
		// the scores from the formData and store them in the database

		let username = authenticate.getUsername(req);
		if (username) {
			let formData = req.body;

			let formKeys = Object.keys(formData);
			let i = 0;
			let userPrediction = new Array(formKeys.length / 2);

			for (i; i < userPrediction.length; i++) {
				userPrediction[i] = [
					formData[formKeys[i * 2]],
					formData[formKeys[i * 2 + 1]]
				];
			}

			let user = await controller.getUser(app, username);
			user.games.userPrediction = userPrediction;

			let up = {
				games: [
					{
						gameID: 1,
						matchPredictions: userPrediction
					}
				]
			};

			res.redirect('/');
			controller.addUserPredictions(app, up, user, res);
		} else {
			res.redirect('/');
			console.info('Session ran out');
		}
	});
    
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

  router.get("/matches", async (req, res) => {
    if (authenticate.isAuthenticated(req)) {
      let meme = await controller.getGame(app);
      return res.render("matches", {
        loggedIn: true,
        title: "game week one",
        meme: meme
      });
    } else {
      res.redirect("/login");
    }
  });

  router.get("/live" , async (req, res) => {

    let results = liveGame.getResults()
    let game = await controller.getGame(app);

    for(var i = 0; i < game[0].matches.length; i++) {
      game[0].matches[i][0].score = results[i][0]
      game[0].matches[i][1].score = results[i][1]
    }
    
      
    console.log('results ' + results)

    return res.render("live", {
      loggedIn: authenticate.isAuthenticated(req),
      title: "live view",
      meme: game,
      results: results
    });
    //return res.json(results);
  })

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

  // THESE ROUTES ARE ONLY FOR TESTING AND NOT PART
  // OF THE MAIN SITE

  router.get("/api/user", async (req, res) => {
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
   //FOR THE RESULTS PAGE
  // router.get("/results", async (req, res) => {
  //   if (authenticate.isAuthenticated(req)) {
  //     let hoyeah = await controller.getResults(app);
  //     return res.render("results", {
  //       loggedIn: true,
  //       title: "Results",
  //       hoyeah: hoyeah
  //     });
  //   } else {
  //     res.redirect("/login");
  //   }
  // });

  router.get("/results", async (req, res) => {
    let username = "janedoe356"//authenticate.getUsername(req)
    if( username) {
      let user = await controller.getUser(app, username)
      
      // this will eventually be parsed from the user object
      //let predictions = user.gameData[0].predictions
      let predictions = [ [10, 20], [30, 40], [50, 60], [70, 80], [90, 100], [110, 120] ]
      let results = [ [10, 20], [30, 40], [50, 60], [70, 80], [90, 100], [110, 120] ]
      let scores = [ 20, 0, 0, 0, 30, 20 ]
      let total = 10;

      let gameData = {
        predictions: predictions,
        results: results,
        scores: scores,
        total: total
      }

      return res.render("results", {
        gameData: gameData
      })
    } else {
      res.redirect("/login");
    }
    //let results = await controller.getUsers(app);
    //return res.json(results);
  });

  return router;
};
