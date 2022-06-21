'use strict'

const mongoose = require('mongoose')

const reservationSchema = Schema({
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    user:{type: Schema.ObjectId, ref: 'user'},
    room:{type: Schema.ObjectId, ref: 'room'},
    hotel:{type: Schema.ObjectId, ref: 'hotel'},
    services:[{type: Schema.ObjectId, ref: 'service'}]


})

module.exports = mongoose.model('reservation', reservationSchema)