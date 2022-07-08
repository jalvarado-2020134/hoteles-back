'use strict'

const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    hotel: {type: mongoose.Schema.ObjectId, ref: 'hotel'},
    name: String,
    description: String,
    price: Number,
    state: Boolean,
    dateAvailable: Date

})

module.exports = mongoose.model('room', roomSchema)