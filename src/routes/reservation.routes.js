'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const reservationController = require('../controllers/reservation.controller');

api.post('/makeReservation/:idHotel', [mdAuth.ensureAuth],reservationController.makeReservation);
api.get('/myReservation',[mdAuth.ensureAuth], reservationController.myReservation);
api.get('/getReservations/:idHotel',[mdAuth.ensureAuth], reservationController.getReservations);
api.get('/getReservation/:id',[mdAuth.ensureAuth], reservationController.getReservation);
api.delete('/deleteReservation/:idHotel/:idReservation',[mdAuth.ensureAuth], reservationController.deleteReservation);
api.get('/getInProgress/:idHotel',[mdAuth.ensureAuth], reservationController.reservationsInProgress);
api.get('/getBilled/:idHotel',[mdAuth.ensureAuth], reservationController.reservationsBilled);
api.get('/getCancelled/:idHotel',[mdAuth.ensureAuth], reservationController.reservationsCancelled)

module.exports = api;