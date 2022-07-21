'use strict'

const mongoose = require('mongoose')

const billSchema = mongoose.Schema({
    date: Date,
    total: Number,
    user:{type:mongoose.Schema.ObjectId, ref: 'User'},
    reservation:[{type: mongoose.Schema.ObjectId, ref: 'reservation'}]
})

module.exports = mongoose.model('bill', billSchema)