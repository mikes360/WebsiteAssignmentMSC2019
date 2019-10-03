let DB_URL = 'mongodb://localhost:27017'
let DB_NAME = 'filmsDb'
let DB_ALIAS = 'myDb'

const MongoClient = require('mongodb').MongoClient 

async function connect(app) 
{ 
    MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => 
    {  
        app.set(DB_ALIAS, client.db(DB_NAME))  
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

 
module.exports = { connect, getUsers, getUser, addUser }; 