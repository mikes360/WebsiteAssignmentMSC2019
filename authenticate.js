const jwt = require("jsonwebtoken");

function login(req, res) {
    let username = req.query.username
    let password = req.query.password

    //this lookup would normally be done using a database
    if (username === "bob") {
        if (password === "pass") { 
            const opts = {} //the password compare would normally be done using bcrypt.
            opts.expiresIn = 120;  //token expires in 2min
            const secret = "SECRET_KEY" //normally stored in process.env.secret
            const token = jwt.sign({ username }, secret, opts);

            res.cookie('access_token', token, {
                maxAge: 1000 * 30,
                httpOnly: true,
            });

            return res.status(200).json({ message: "Auth Passed", token })
        }
    }
    return res.status(401).json({ message: "Auth Failed" })
}

function isAuthenticated(req) {  
    let authenticated = false
    let token = req.cookies.access_token
    if( token) { 
        jwt.verify(token, 'SECRET_KEY', (err, decoded) =>{
            if(!err){
                authenticated = true

            }
        })
    }
    return authenticated;
}

/*function isAuthenticated(req, res, next) {  
    let token = req.cookies.access_token
    if( !token){ 
        res.redirect("../login.html")
    }
    else{
        jwt.verify(token, 'SECRET_KEY', (err, decoded) =>{
            if(err){
                res.redirect("../login.html")
            }
            else{
                next()
            }
        });
    }
} */

module.exports = { login, isAuthenticated }; 