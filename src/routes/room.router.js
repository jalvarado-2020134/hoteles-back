'use strict'

const express = require('express');
const mdAuth = require('../services/authenticated');
const api = express.Router();
const roomController = require('../controllers/room.controller');

api.post('/newRoom', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.newRoom);
api.put('/updateRoom/:id', [mdAuth.ensureAuth,mdAuth.isAdmin], roomController.updateRoom);
api.delete('/deleteRoom/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],roomController.deleteRoom);
api.get('/getRoom/:id', mdAuth.ensureAuth, roomController.getRoom);
api.get('/getRooms', mdAuth.ensureAuth, roomController.getRooms);
api.get('/roomByHotel/:id', mdAuth.ensureAuth,roomController.roomByHotel);

module.exports = api;