let DB_URL = 'mongodb://localhost:27017'
let DB_NAME = 'filmsDb'
let DB_QUID = 'quidditch'
let DB_ALIAS = 'myDb'
let DB_ALIAS1 = 'myDb'

const MongoClient = require('mongodb').MongoClient 

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

async function getUser(app, name) 
{ 
    return app.set(DB_ALIAS).collection('filmsCollection').find({}).toArray()
}  

async function addUser(app, user)
{
    return "{ }"
}

async function getTeams(app) 
{ 
    return app.set(DB_ALIAS).collection('team').find({}).toArray()
}

async function getGame(app)
{
    return app.set(DB_ALIAS).collection('game').find({}).toArray()
}
 
module.exports = { connect, getUsers, getUser, addUser, getTeams, getGame }; 