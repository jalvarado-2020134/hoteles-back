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
    


})

module.exports = mongoose.model('user', userSchema)