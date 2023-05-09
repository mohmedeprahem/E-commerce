// Package requirement
const jwt = require('jsonwebtoken')

exports.getUserInfo = (req, res, next) => {
  try {
    req.isLoggedIn = false;
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
      req.user = decoded;
    }
    next()
  } catch(err) {
    next(err)
  }
}
