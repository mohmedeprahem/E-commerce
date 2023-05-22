const reviewSchema = require('../models/review')
const ProductSchema = require('../models/product')
const orderSchema = require('../models/order')


// @route: 'POST'  api/v1/reviews/addNewReview/:productId
// @disc: create new review
// @access: private(user: sall porduct)
exports.postReview = async (req, res, next) => {
  try {
    // check product found
    const productInfos = await ProductSchema.findById(req.params.productId)

    if (!productInfos) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not Found.",
      })
    }
    // check if user bought this product
    const orderInfos = await orderSchema.findOne({
      userId: req.user.id,
      productIds: {
        $elemMatch: {
          $eq: req.params.productId
        }
      }
    })

    if(!orderInfos) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "User must buy this product first before review it.",
      })
    }

    // check if user has already review
    const reviewInfo = await reviewSchema.findOne({
      userId: req.user.id,
      productId: req.params.productId
    })

    if (reviewInfo) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Review already exist."
      })
    }

    const result = await reviewSchema.create({
      userId: req.user.id,
      productId: req.params.productId,
      ...req.body
    })

    productInfos.countRates++
    productInfos.sumRates += req.body.rate
    await productInfos.save()

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Review added successfully.",
      reviews: result
    })
  } catch (err) {
    next(err)
  }
}

// @route: 'GET'  api/v1/product/reviews/:productId?page=1
// @disc: get all reviews
// @access: public
exports.getReviews = async (req, res, next) => {
  try {
    const page = req.query.page || 1
    const limit = 10
    const skip = (page - 1) * limit

    const reviews = await reviewSchema.find({
      productId: req.params.productId
    })
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'userId',
      select: '-_id firstName lastName'
    })
    .select('comment rate')
    const totalReviewsCounter = await reviewSchema.countDocuments();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product reviews.",
      currentPage: page,
      maxPages: Math.ceil(totalReviewsCounter / limit),
      reviews: reviews
    })

  } catch (err) {
    next(err)
  }
}

// @route: 'DELETE'  api/v1/reviews/:reviewId
// @disc: delete review
// @access: private(user: review owner)
exports.deleteReview = async (req, res, next) => {
  try {
    const reviewInfo = await reviewSchema.findById(req.params.reviewId)
    if (!reviewInfo) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not Found."
      })
    }

    // check if user authorized
    if (!reviewInfo.userId === req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Forbidden."
      })
    }

    await ProductSchema.updateOne({ _id: reviewInfo.productId }, {
      $inc: {
        countRates: -1,
        sumRates: -reviewInfo.rate
      }
    })

    await reviewInfo.deleteOne();

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Review deleted successfully."
    })
  } catch (err) {
    next(err)
  }
}

// @route: 'DELETE'  api/v1/reviews/:reviewId
// @disc: Edit review
// @access: private(user: review owner)
exports.putReview = async (req, res, next) => {
  try {
    const rate = req.body.rate
    const reviewInfo = await reviewSchema.findById(req.params.reviewId)
    if (!reviewInfo) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Not Found."
      })
    }

    // check if user authorized
    if (!reviewInfo.userId === req.user.id) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Forbidden."
      })
    }

    const newRate = rate - reviewInfo.rate
    // Update review
    reviewInfo.rate = req.body.rate
    reviewInfo.comment = req.body.comment

    await reviewInfo.save()

    await ProductSchema.updateOne({ _id: reviewInfo.productId }, {
      $inc: {
        sumRates: newRate
      }
    })

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "ٌٌٌReview updated successfully.",
      reviews: reviewInfo
    });
  } catch (err) {
    next(err)
  }
}