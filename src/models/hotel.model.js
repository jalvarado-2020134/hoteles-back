'use strict'

const mongoose = require('mongoose');

const Hotel = mongoose.Schema({
    name: String,
    address: String,
    image: String,
    phone: String,
    timesRequest: Number,
    manager: {type: mongoose.Schema.ObjectId, ref: 'User'},

})

module.exports = mongoose.model('Hotel', Hotel)