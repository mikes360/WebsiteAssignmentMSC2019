const express = require("express");
const router = express.Router();

const controller = require("../controller");
const authenticate = require("../authenticate");
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

      // change this from string to number
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
    if (username) {
      if (liveGame.isRunning()) {
        let results = await liveGame.getResultsByUsername(app, username);
        if (results.firstGoldenSnitchTeamResult != -1) {
          results.firstGoldenSnitchTeamResult = await controller.getTeam(app, results.firstGoldenSnitchTeamResult);
        }

        if (results.firstGoldenSnitchTeamPrediction != -1) {
          results.firstGoldenSnitchTeamPrediction = await controller.getTeam(app, results.firstGoldenSnitchTeamPrediction);
        }

        // let Prediction = await liveGame.getResultsByUsername(app, username);
        // if (Prediction.firstGoldenSnitchTeamPrediction != -1) {
        //   Prediction.firstGoldenSnitchTeamPrediction = await controller.getTeam(app, Prediction.firstGoldenSnitchTeamPrediction);
        // }

        return res.json(results);
      } else {
        res.json("Game Not Started");
      }
    } else {
      res.status(404).json("Unauthorized");
    }
  });

  router.get("/game/live/lockscore", async (req, res) => {
    let username = authenticate.getUsername(req);
    if (username) {
      let user = await controller.getUser(app, username);
      let game = user.games[0];
      if (!game.lockedIn) {
        let results = await liveGame.getResultsByUsername(app, username);

        game.matchScores = results.matchScores;
        game.totalScore = results.totalScore;
        game.lockedIn = true;
        user.games[0] = game;
        await controller.updateUser(app, user);
        return res.status(200).json("Score locked in");
      } else {
        res.json("Score already locked in");
      }
    } else {
      res.status(404).json("Unauthorized");
    }
    console.info("Score locked in");
  });
  router.get("/leaderboard", async (req, res) => {
    let users = await controller.getUsers(app);

    let usersFiltered = new Array();
    users.forEach(element => {
      let user = new Object();
      user.username = element.username;
      user.grandTotal = element.grandTotal;
      usersFiltered.push(user);
    });

    usersFiltered.sort((a, b) => (a.grandTotal > b.grandTotal ? -1 : b.grandTotal > a.grandTotal ? 1 : 0));

    return res.status(200).json(usersFiltered);
  });
  return router;
};
