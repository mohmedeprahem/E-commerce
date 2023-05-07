// package requirement
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

// inti express
const app = express();

// parse the req.body
app.use(express.json())

// active routes
const authRoutes = require('./routes/auth')
app.use(authRoutes)

// Connect to DataBase
mongoose.connect(`mongodb+srv://mohmed123:mohmed123@board-game-shop.vsepsuu.mongodb.net/e_commerce`)
.then(() => console.log(`Connect to database....`))

// Connect to server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Connect to server at port: ${port}...`)
})