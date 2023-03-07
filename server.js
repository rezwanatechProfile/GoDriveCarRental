const express = require('express');
const app = express();
const mongoose = require('mongoose')
const Car = require('./models/cars.js')
const methodOverride = require("method-override")
require('dotenv').config();

//connect database
mongoose.connect(process.env.DATABASE_URL, {
    useNewURLParser: true,
    useUnifiedTopology: true
})

//Mongo error/success
const db = mongoose.connection

db.on('error', (err) => {
    console.log(`${err.message} is MONGODB not running?`)
})
db.on('connected', () => {
    console.log(`mongo connected`)
})
db.on('disconnected', () => {
    console.log(`mongo disconnected`)
})


// PORT
const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}`);
});