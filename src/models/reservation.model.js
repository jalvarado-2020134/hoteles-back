'use strict'

const mongoose = require('mongoose')

const reservationSchema = mongoose.Schema({
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    state: String,
    user:{type: mongoose.Schema.ObjectId, ref: 'user'},
    room:[{type: mongoose.Schema.ObjectId, ref: 'room'}],
    hotel:[{type: mongoose.Schema.ObjectId, ref: 'hotel'}],
    services:[{
        quantity: Number,

        service: {type: mongoose.Schema.ObjectId, ref: 'service'}}]


});

module.exports = mongoose.model('reservation', reservationSchema)