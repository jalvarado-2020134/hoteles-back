'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const reservationController = require('../controllers/reservation.controller');

api.post('/makeReservation', [mdAuth.ensureAuth],reservationController.makeReservation);
api.get('/getReservation/:id', [mdAuth.ensureAuth], reservationController.getReservation);
api.get('/getReservations/:idHotel', [mdAuth.ensureAuth],reservationController.getReservations);
api.delete('/deleteReservation/:idHotel/:idReservation',[mdAuth.ensureAuth], reservationController.deleteReservation);

module.exports = api;