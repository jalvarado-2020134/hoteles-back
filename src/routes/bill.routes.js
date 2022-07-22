'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const billController = require('../controllers/bill.controller');
const connectMultiParty = require('connect-multiparty');
const upload = connectMultiParty({uploadDir: './pdfs'});

api.post('/createBill/:id', billController.createBill);
api.get('/getBill/:idReservation', billController.getBill);

module.exports = api;