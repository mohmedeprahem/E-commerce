// package requirement
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const path = require('path')

// inti express
const app = express();


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// parse the req.body
app.use(express.json())

// Inti cookie parser
app.use(cookieParser());

// Access to public folder
app.use(express.static(path.join(__dirname, 'public/upload/img')));

// save user info in req.user
const { getUserInfo } = require('./middlewares/getcookie')
app.use(getUserInfo)

// active routes
const authRoutes = require('./routes/auth')
app.use(authRoutes)
const userRoutes = require('./routes/user')
app.use(userRoutes)
const productRoutes = require('./routes/product')
app.use(productRoutes)
const cartRoutes = require('./routes/cart')
app.use(cartRoutes)

// Error hander
const errorHander = require('./middlewares/errorHander')
app.use(errorHander)

// Connect to DataBase
mongoose.connect(`mongodb+srv://mohmed123:mohmed123@board-game-shop.vsepsuu.mongodb.net/e_commerce`)
.then(() => console.log(`Connect to database....`))

// Connect to server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Connect to server at port: ${port}...`)
})