const express = require('express');
const router = express.Router();

const controller = require('./controller'); 

const authenticate = require("./authenticate");
var path = require('path');

module.exports = (app) => {

    router.get('/login', (req, res) => authenticate.login(req, res))

    router.post('/api/user', (req, res) => {
        res.status(200).send('<p>Added</p>')
    })

    router.get("/", (req, res) => {
        return res.render("main", { })
    })

    router.get('/matches', async (req, res) => {
        if( authenticate.isAuthenticated(req) ) {
            let meme = await controller.getGame(app)
            return res.render("matches", {
                title: "game week one",
                meme: meme
            })          
        }
        else {
            res.redirect("/login.html")
        }
    })

    
    // THESE ROUTES ARE ONLY FOR TESTING AND NOT PART 
    // OF THE MAIN SITE

    router.use('/user', (req, res)  => {         
        if( authenticate.isAuthenticated(req) ) {
            let absoluteFilePath = path.join(__dirname, '/user', req.url)
            return res.sendFile(absoluteFilePath)            
        }
        else {
            res.redirect("../login.html")
        }       
    })

    router.get('/api/user', async (req, res) => {
        if( authenticate.isAuthenticated(req) ) {
            let users = await controller.getUsers(app)
            return res.json(users)
        }
        else {            
            res.status(404).send("Unauthorized")         
        }  
    })

    router.get('/team', async (req, res) => {
        let team = await controller.getTeams(app)
        return res.json(team)
    })

    router.get('/game', async (req, res) => {
        let game = await controller.getGame(app)
        return res.json(game)
    })

    return router;
}
        