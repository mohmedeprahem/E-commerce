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

// @route: 'GET'  api/v1/products/slider
// @disc: Get card slider images
// @access: public
exports.getProductSlider = async (req, res, next) => {
  try {
    const productsInfo = await ProductSchema.find().sort({ timestamp: -1 }).limit(5).select('_id imgs')

    const cardSlider = productsInfo.map(product => {
      return {
        _id: product._id,
        img: product.imgs[0]
      }
    })
  
    if (!cardSlider.length) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not Found."
      })
    }
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Card slider imgs.",
      cardSlider: cardSlider
    })
  } catch (err) {
    next(err)
  }
}

// @route: 'GET'  api/v1/products/home
// @disc: Get products at home page
// @access: public
exports.getProductatHomePage = async (req, res, next) => {
  try {
    const inStockHighestRatedProducts = await ProductSchema.find({
      outOfStock: false
    })
    .sort({ starRating: -1 })
    .limit(2)
    .select({
      id: "_id",
      image: { $arrayElemAt: ['$imgs', 0] },
      name: 1,
      price: 1,
      outOfStock: 1,
      _id: 0
    })

    const outOfStockHighestRatedProducts = await ProductSchema.find({
      outOfStock: true
    })
    .sort({ starRating: -1 })
    .limit(1)
    .select({
      id: "_id",
      image: { $arrayElemAt: ['$imgs', 0] },
      name: 1,
      price: 1,
      outOfStock: 1,
      _id: 0
    })

    const bestSellerProducts = await ProductSchema.find().sort({ soldCount: -1 }).limit(6)
    .select({
      id: "_id",
      image: { $arrayElemAt: ['$imgs', 0] },
      name: 1,
      price: 1,
      outOfStock: 1,
      _id: 0
    })

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Home page products.",
      inStockHighestRatedProducts,
      outOfStockHighestRatedProducts,
      bestSellerProducts
    })
  } catch (err) {
    next(err)
  }
}
