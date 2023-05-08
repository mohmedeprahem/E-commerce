const mongoose = require('mongoose')

const errorHander = (err, req, res, next) => {
  console.log(err)
  if (err instanceof mongoose.Error || err.name === 'MongoError') {
    if (err.kind == 'ObjectId') {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Invalid id."
      });
    }
    
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Bad request."
    });
  }

  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Server error."
  }); 
}


module.exports = errorHander