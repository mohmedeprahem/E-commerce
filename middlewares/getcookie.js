// Package requirement
const jwt = require('jsonwebtoken')

exports.getUserInfo = (req, res, next) => {
  try {
    req.isLoggedIn = false;
    const token = req.cookies.jwt;
    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT)

      // Token is valid, check the expiration
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        // Token has expired
        return res.status(401).clearCookie('jwt').json({
          success: false,
          statusCode: 401,
          message: "JWT Expired."
        });
      }
      req.isLoggedIn = true;
      req.user = decoded;
    }
    next()
  } catch(err) {
    next(err)
  }
}
