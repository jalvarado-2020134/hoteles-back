'use strict'

const mongoose = require('mongoose');

const Service = mongoose.Schema({
    
    hotel: {type: mongoose.Schema.ObjectId, ref: 'Hotel'},
    name: String,
    description: String,
    price: Number,


});

module.exports = mongoose.model('Service', Service);