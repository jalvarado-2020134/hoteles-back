'use strict'

const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    hotel: {type: mongoose.Schema.ObjectId, ref: 'Hotel'},
    name: String,
    description: String,
    price: Number,
    available: Boolean,
    dateAvailable: Date

})

module.exports = mongoose.model('room', roomSchema)