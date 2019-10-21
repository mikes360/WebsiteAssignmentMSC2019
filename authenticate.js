const jwt = require("jsonwebtoken")
const controller = require("./controller")

async function login(app, req, res) {

  let username = req.query.username;
  let password = req.query.password;
  let userJson = await controller.getUser(app, username)

  if (userJson != null && password === userJson.password) {

    const token = jwt.sign({ username }, process.env["AUTHENTICATE_KEY"], {expiresIn: 3600})

    res.cookie("access_token", token, { httpOnly: true })
    return res.status(200).json({ message: "Auth Passed", token })
  }
  return res.status(401).json({ message: "Auth Failed" })
}

function logout(res) {
  res.clearCookie("access_token")
}

function isAuthenticated(req) {
  let authenticated = false //can change temporarily to true to login
  let token = req.cookies.access_token
  if (token) {
    jwt.verify(token, process.env["AUTHENTICATE_KEY"], (err, decoded) => {
      if (!err) {
        authenticated = true
      }
    })
  }
  return authenticated
}

module.exports = { login, logout, isAuthenticated }
