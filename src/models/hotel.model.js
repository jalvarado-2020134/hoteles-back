'use strict'

const mongoose = require('mongoose')

const hotelSchema = Schema({
    adminHotel: {type: Schema.ObjectId, ref: 'user'},
    name: String,
    address: String,
    image: String,
    phone: String,
    timesRequest: Number,
})

module.exports = mongoose.model('hotel', hotelSchema)