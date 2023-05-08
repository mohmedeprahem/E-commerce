const mongoose = require('mongoose')

const errorHander = (err, req, res, next) => {
  console.log(err)
  if (err instanceof mongoose.Error || err.name === 'MongoError') {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Bad request."
    });
  }
}


module.exports = errorHander