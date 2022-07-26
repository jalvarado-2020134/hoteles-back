'use strict'

const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();
const hotelController = require('../controllers/hotel.controller');
const connectMultiParty = require('connect-multiparty');
const upload = connectMultiParty({uploadDir: './uploads/hotels'});

api.post('/newHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], hotelController.newHotel);
api.put('/updateHotel/:id', [mdAuth.ensureAuth,mdAuth.isAdmin], hotelController.updateHotel);
api.delete('/deleteHotel/:id', [mdAuth.ensureAuth,mdAuth.isAdmin], hotelController.deleteHotel);
api.get('/getHotel/:id', [mdAuth.ensureAuth], hotelController.getHotel);
api.get('/getHotels', [mdAuth.ensureAuth], hotelController.getHotels);
api.post('/searchHotel', [mdAuth.ensureAuth], hotelController.hotelByName);
api.post('/uploadImage/:id',[mdAuth.ensureAuth,upload], hotelController.uploadImage);
api.get('/getImage/:fileName', upload, hotelController.getImage);
api.get('/getHistory', mdAuth.ensureAuth, hotelController.getHistory);
api.get('/getByMostRequested', mdAuth.ensureAuth, hotelController.getHotelsByMostRequested)

module.exports = api;