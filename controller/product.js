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

// @route: 'GET'  api/v1/products/all?page=1&outOfStock=true&minPrice=200&maxPrice=500
// @disc: Get all product
// @access: public
exports.getAllPruducts = async (req, res, next) => {
  try {
    const filter = {}

    if (req.query.outOfStock) {
      filter.outOfStock = req.query.outOfStock === 'true'
    }

    if (req.query.minPrice) {
      filter.price = {
        $gte: req.query.minPrice 
      };
    }
    filter.price = {
      $gte:  parseInt(req.query.minPrice) || 0
    };

    if (req.query.maxPrice) {
      filter.price.$lte = parseInt(req.query.maxPrice)
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    console.log(filter)

    const productsInfo = await ProductSchema.find(filter).skip(offset).limit(limit).select({
      id: "_id",
      image: { $arrayElemAt: ['$imgs', 0] },
      name: 1,
      price: 1,
      outOfStock: 1,
      _id: 0
    })

    const totalItemsCount = await ProductSchema.countDocuments(filter); // Get the total count of items based on the filter

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "All Products.",
      totalItemsCount,
      maxPages: Math.ceil(totalItemsCount / limit),
      currentPage: page,
      itemPerPage: 10,
      products: productsInfo
    })
  } catch(err) {
    next (err)
  }
}

// @route: 'GET'  api/v1/products/search?product=T-Shirt&page=1
// @disc: Search product based on product name
// @access: public
exports.getSearchProducts = async (req, res, next) => {
  try {
    const filter = {}
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    if (req.query.product) {
      filter.name = req.query.product
    }
    console.log(filter)

    const productsInfo = await ProductSchema.find(filter).skip(offset).limit(limit).select({
      id: "_id",
      image: { $arrayElemAt: ['$imgs', 0] },
      name: 1,
      _id: 0
    })

    const totalItemsCount = await ProductSchema.countDocuments(filter); // Get the total count of items based on the filter

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "All Products.",
      totalItemsCount,
      maxPages: Math.ceil(totalItemsCount / limit),
      currentPage: page,
      itemPerPage: 10,
      products: productsInfo
    })
  } catch (err) {
    next(err)
  }
}

// @route: 'GET' /api/v1/products/singleProduct/:productId
// @disc: Get product info
// @access: public
exports.getProductInfo = async (req, res, next) => {
  try{
    const productInfos = await ProductSchema.findById(req.params.productId)

    if (!productInfos) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not found."
      })
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product data.",
      product: {
        _id: productInfos._id,
        imgs: productInfos.imgs,
        name: productInfos.name,
        price: productInfos.price,
        totalRates: productInfos.soldCount,
        size: productInfos.size,
        color: productInfos.color,
        productInfo: productInfos.productInfo,
        description: productInfos.desc,
        outOfStock: productInfos.outOfStock
      }
    }) 
  } catch(err) {
    next(err)
  }
}

// @route: 'GET' api/v1/products/suggestedProducts
// @disc: Get suggested products related
// @access: public
exports.getSuggestProduct = async (req, res, next) => {
  try {
    const productInfos = await ProductSchema.aggregate([
      { $sample: { size: 8 } },
      { $project: { name: 1, img: { $arrayElemAt: ['$imgs', 0] }, price: 1 } }
    ])

    console.log(productInfos);

    if (!productInfos.length) {
      return res.status(200).json({
        success: false,
        statusCode: 404,
        message: "Not Found.",
        
      })
  
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product data.",
      suggestedProduct: productInfos
    })

  } catch (err) {
    next(err)
  }
}