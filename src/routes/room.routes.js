'use strict'

const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();
const roomController = require('../controllers/room.controller');

api.post('/newRoom', [mdAuth.ensureAuth, ], roomController.newRoom);
api.put('/updateRoom/:id', [mdAuth.ensureAuth,], roomController.updateRoom);
api.delete('/deleteRoom/:id',[mdAuth.ensureAuth,],roomController.deleteRoom);
api.get('/getRoom/:id', [mdAuth.ensureAuth, ], roomController.getRoom);
api.get('/getRooms', [mdAuth.ensureAuth,], roomController.getRooms);
api.get('/roomByHotel/:id', [mdAuth.ensureAuth, ],roomController.roomByHotel);
api.get('/roomAvailable', [mdAuth.ensureAuth, ], roomController.roomsAvailable);
api.get('/roomNoAvailable', [mdAuth.ensureAuth, ], roomController.roomsNotAvailables);
api.post('getRoomByName', [mdAuth.ensureAuth],roomController.roomByName);

module.exports = api;