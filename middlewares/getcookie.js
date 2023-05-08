// Package requirement
const jwt = require('jsonwebtoken')

exports.getUserInfo = (req, res, next) => {
  try {
    req.isLoggedIn = false;
    const mycookie = req.cookies;
    if (mycookie) {
      const decoded = jwt.verify(mycookie.jwt, process.env.SECRET_KEY_JWT);
      req.user = decoded;
    }
    next()
  } catch(err) {
    next(err)
  }
}
