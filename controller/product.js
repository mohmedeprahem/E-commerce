const ProductSchema = require('../models/product')

// util files
const {deleteFiles} = require('../util/deleteFile')

// @route: 'POST'  api/v1/product
// @disc: create new product
// @access: private(admin)
exports.postProduct = async (req, res, next) => {
  try {
    console.log(req.files, req.body)
    let imgsPath = []

    // Check file size
    let invalidFiles = false
    for (let i = 0; i < req.files.length; i++) {
      if (req.files[i].size >  5 * 1024 * 1024) {
        invalidFiles = true
        break;
      }
    }

    // Delete files if one file langer than 5 MB
    if (invalidFiles) {
      deleteFiles(req.files)
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "files is too large",
      
      })
    };

    if (req.files) {
      req.files.forEach(element => {
        imgsPath.push(element.filename)
      });
    }

    const result = await new ProductSchema({
      name: req.body.name,
      imgs: imgsPath,
      price: parseFloat(req.body.price),
      color: req.body.color,
      size: req.body.size,
      productInfo: req.body.productInfo,
      desc: req.body.desc
    })
    result.save()
    
    return res.status(201).json({
      succes: true,
      statusCode: 201,
      message: "Create new product"
    })
  } catch (err) {
    next(err)
  }
}