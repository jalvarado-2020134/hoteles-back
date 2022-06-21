'use strict'

const mongoose = require('mongoose')

const roomSchema = Schema({
    hotel: {type: Schema.ObjectId, ref: 'hotel'},
    name: String,
    description: String,
    price: Number,
    available: Boolean,
    dateAvailable: String

})

module.exports = mongoose.model('room', roomSchema)