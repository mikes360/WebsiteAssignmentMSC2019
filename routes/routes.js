const express = require('express');

const router = express.Router();

module.exports = (app) => {

    // router.get('/main', (req, res) => {
    //     return res.render('main', {
    //         title: 'EJS Example from Parts', 
    //         message: 'Hello Template built in parts',
    //         showMsg: true,
    //         headingOne: 'Page made from parts'
    //         });
    // })

    router.get('/main', (req, res) =>{
        return res.render('main', {
            title: 'testing ejs oh hi mark'
        })
    })

    return router;
}