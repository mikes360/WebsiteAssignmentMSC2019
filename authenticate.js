const jwt = require("jsonwebtoken");

const controller = require("./controller");

async function login(app, req, res) {
  let username = req.query.username;
  let password = req.query.password;

  let userJson = await controller.getUser(app, username);

  if (userJson != null && password === userJson.password) {
    const opts = {}; //the password compare would normally be done using bcrypt.
    opts.expiresIn = 120; //token expires in 2min
    const secret = "SECRET_KEY"; //normally stored in process.env.secret
    const token = jwt.sign({ username }, secret, opts);

    res.cookie("access_token", token, {
      maxAge: 1000 * 30,
      httpOnly: true
    });

    return res.status(200).json({ message: "Auth Passed", token });
  }
  return res.status(401).json({ message: "Auth Failed" });
}

function isAuthenticated(req) {
  let authenticated = false; //can change temporarily to true to login
  let token = req.cookies.access_token;
  if (token) {
    jwt.verify(token, "SECRET_KEY", (err, decoded) => {
      if (!err) {
        authenticated = true;
      }
    });
  }
  return authenticated;
}

module.exports = { login, isAuthenticated };
