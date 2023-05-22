// package requirement
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const path = require('path')

// inti express
const app = express();

// CORS security
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// checkout routes saved here bec data parse in diff way
const checkoutRoute = require('./routes/checkout')
app.use(checkoutRoute)

// Inti cookie parser
app.use(cookieParser());

// parse the req.body
app.use(express.json())

// Access to public folder
app.use(express.static(path.join(__dirname, 'public/upload/img')));

// save user info in req.user
const { getUserInfo } = require('./middlewares/getcookie')
app.use(getUserInfo)

// active routes
app.get('/success',express.raw({ type: 'application/json' }), (req, res) => {
  res.sendFile(__dirname + '/views/success.html');
})

const authRoutes = require('./routes/auth')
app.use(authRoutes)
const userRoutes = require('./routes/user')
app.use(userRoutes)
const productRoutes = require('./routes/product')
app.use(productRoutes)
const cartRoutes = require('./routes/cart')
app.use(cartRoutes)
const reviewRoutes = require('./routes/review')
app.use(reviewRoutes)

// Error hander
const errorHander = require('./middlewares/errorHander')
app.use(errorHander)

// Connect to DataBase
mongoose.connect(`mongodb+srv://mohmed123:mohmed123@board-game-shop.vsepsuu.mongodb.net/e_commerce`)
.then(() => console.log(`Connect to database....`))

// Connect to server robust-aspire-soft-bliss
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Connect to server at port: ${port}...`)
})