exports.isAuthanticated = (req, res, next) => {
  if (!req.isLoggedIn) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Unauthorized."
    })
  }
  next()
}