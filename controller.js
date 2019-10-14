<<<<<<< Updated upstream
let DB_URL = 'mongodb://localhost:27017'
let DB_NAME = 'filmsDb'
let DB_QUID = 'quidditch'
let DB_ALIAS = 'myDb'
let DB_ALIAS1 = 'myDb'
=======
let DB_URL = "mongodb://localhost:27017";
let DB_NAME = "quidditch";
let DB_ALIAS = "myDb";
>>>>>>> Stashed changes

const MongoClient = require("mongodb").MongoClient;

<<<<<<< Updated upstream
//connection to the film database
async function connect(app) 
{ 
    MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => 
    {  
        app.set(DB_ALIAS, client.db(DB_QUID))  
    })  
} 
 
async function getUsers(app) 
{ 
    return app.set(DB_ALIAS).collection('filmsCollection').find({}).toArray()
}  
=======
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
  let name = "userUsername";
  return app
    .set(DB_ALIAS)
    .collection("users") //change this to user details database
    .find({ name })
    .toArray();
}
>>>>>>> Stashed changes

async function addUser(app, nu, res) {
  //if(nu.username === "")

  const db = app.get(DB_ALIAS);
  const collection = db.collection("users");
  collection.insertOne(nu, function(err, result) {
    if (err != null) {
      console.log(err);
      res.status(200).send("<p>Fail</p>");
    } else {
      res.redirect("../index.html");
    }
  });
  // return app
  //   .set(DB_ALIAS)
  //   .collection("users") //change this to user details database
  //   .append(user)
  //   .toArray();
}

<<<<<<< Updated upstream
async function getTeams(app) 
{ 
    return app.set(DB_ALIAS).collection('team').find({}).toArray()
}

async function getGame(app)
{
    let game = await app.set(DB_ALIAS).collection('game').find({}).toArray()
    let teams = await getTeams(app)

    //let bob = game[0].matches
    //let bob2 = bob[0]

    

    for(var i = 0; i < game[0].matches.length; i++) {
        game[0].matches[i][0] = getTeam(teams, game[0].matches[i][0])
        game[0].matches[i][1] = getTeam(teams, game[0].matches[i][1])
    }

    /*for(var match in game[0].matches){
        match[0] = getTeam(teams, match[0])
        match[1] = getTeam(teams, match[1])
    }*/
    
    return game
    // getTeams()
    // getGames()

    // foreach(match in game.matches)
    // getTeam with id === match[0] id and match[1] id
    // replace id string with team object
    //return app.set(DB_ALIAS).collection('game').find({}).toArray()
}

function getTeam(teams, id) {
    for(var i = 0; i < teams.length; i++) {
        if(teams[i].teamID === id){
            return teams[i];
        }

    }

}

 
module.exports = { connect, getUsers, getUser, addUser, getTeams, getGame }; 
=======
module.exports = { connect, getUsers, getUser, addUser };
>>>>>>> Stashed changes
