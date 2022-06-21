'use strict'

const mongoose = require('mongoose')

const eventSchema = Schema({
    hotel: {type: Schema.ObjectId, ref: 'hotel'},
    name: String,
    category: String,
    description: String,
    dateEvent: Date
})

module.exports = mongoose.model('event', eventSchema)