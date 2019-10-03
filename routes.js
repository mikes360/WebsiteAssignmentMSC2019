const express = require('express');
const router = express.Router();

const controller = require('./controller'); 

const authenticate = require("./authenticate");
var path = require('path');

module.exports = (app) => {

    router.get('/login', (req, res) => authenticate.login(req, res))

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

    router.post('/api/user', (req, res) => {
        res.status(200).send('<p>Added</p>')
    })
    
    return router;
}