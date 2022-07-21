'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const billController = require('../controllers/bill.controller');

api.post('/createBill/:idHotel/:idReservation',[mdAuth.ensureAuth], billController.createBill);
api.get('/getBills/:idHotel', [mdAuth.ensureAuth], billController.getBills);
api.get('/getBill/:idHotel/:idBill',[mdAuth.ensureAuth], billController.getBill);

module.exports = api;