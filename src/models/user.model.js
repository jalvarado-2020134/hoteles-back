'use strict'

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    surname: String,
    username: String,
    email: String,
    password: String,
    image: String,
    role: String,
    phone: String,
    currentReservation:{type: mongoose.Schema.ObjectId, ref: "reservation"},
    reservation: [{type: mongoose.Schema.ObjectId, ref:"reservation"}],
    history: [{type: mongoose.Schema.ObjectId, ref:"Hotel"}],
    bill: [{type: mongoose.Schema.ObjectId, ref: "bill"}]
    


});

module.exports = mongoose.model('User', userSchema)