'use strict'

const mongoose = require('mongoose')

const billSchema = Schema({
    date: Date,
    total: Number,
    reservation:{type: Schema.ObjectId, ref: 'reservation'}
})

module.exports = mongoose.model('bill', billSchema)