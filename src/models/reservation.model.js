'use strict'

const mongoose = require('mongoose')

const reservationSchema = mongoose.Schema({
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    state: String,
    user:{type: mongoose.Schema.ObjectId, ref: 'User'},
    room:{type: mongoose.Schema.ObjectId, ref: 'room'},
    hotel:{type: mongoose.Schema.ObjectId, ref: 'Hotel'},
    service:[{type: mongoose.Schema.ObjectId, ref: 'Service'}]


});

module.exports = mongoose.model('reservation', reservationSchema)