'use strict'

const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();
const roomController = require('../controllers/room.controller');

api.post('/newRoom', [mdAuth.ensureAuth, mdAuth.isManager], roomController.newRoom);
api.put('/updateRoom/:id', [mdAuth.ensureAuth,mdAuth.isManager], roomController.updateRoom);
api.delete('/deleteRoom/:id',[mdAuth.ensureAuth,mdAuth.isManager],roomController.deleteRoom);
api.get('/getRoom/:id', [mdAuth.ensureAuth, mdAuth.isManager], roomController.getRoom);
api.get('/getRooms', [mdAuth.ensureAuth, mdAuth.isManager], roomController.getRooms);
api.get('/roomByHotel/:id', [mdAuth.ensureAuth, mdAuth.isAdmin],roomController.roomByHotel);
api.get('/roomAvailable', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.roomsAvailable);
api.get('/roomNoAvailable', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.roomsNotAvailables);
api.post('getRoomByName', [mdAuth.ensureAuth],roomController.roomByName);

module.exports = api;