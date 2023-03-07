const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
    name: {type: String, required: true}, 
    Make: {type: String},
    color: {type: String}

})

const Car = mongoose.model('Car', carSchema)

module.exports = Car