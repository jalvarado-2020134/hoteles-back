'use strict'

const mongoose = require('mongoose')

const reservationSchema = mongoose.Schema({
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    user:[{type: mongoose.Schema.ObjectId, ref: 'user'}],
    room:[{type: mongoose.Schema.ObjectId, ref: 'room'}],
    hotel:[{type: mongoose.Schema.ObjectId, ref: 'hotel'}],
    services:[{type: mongoose.Schema.ObjectId, ref: 'service'}]


})

module.exports = mongoose.model('reservation', reservationSchema)