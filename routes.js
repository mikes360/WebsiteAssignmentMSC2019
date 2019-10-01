const express = require('express');
const router = express.Router();

const controller = require('./controller'); 

const authenticate = require("./authenticate");
var path = require('path');

module.exports = (app) => 
{
    router.get('/login', (req, res) => authenticate.login(req, res))

    router.use('/user', (req, res, next) => authenticate.authenticate(req, res, next), (req, res, next) => 
    { 
        let bob = path.join(__dirname, '/user', req.url)
        return res.sendFile(bob)
    })

    router.get('api/users', async (req, res) => 
    { 
        let users = await controller.getUsers(app)
        return res.json(users)  
    })

    return router;
}