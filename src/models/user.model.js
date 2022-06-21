'use strict'

const mongoose = require('mongoose')

const userSchema = Schema({
    name: String,
    surname: String,
    username: String,
    email: String,
    password: String,
    image: String,
    role: String,
    phone: String,
    reservation:[{type: Schema.ObjectId, ref: 'reservation'}],
    bill: [{type: Schema.ObjectId, ref: 'bill'}],
    history: [{type: Schema.ObjectId, ref: 'hotel'}]


})

module.exports = mongoose.model('user', userSchema)