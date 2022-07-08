'use strict'

const express = require('express');
const api  = express.Router();
const mdAuth = require('../services/authenticated');
const serviceController = require('../controllers/service.controller');

api.post('/newService', [mdAuth.ensureAuth], serviceController.newService);
api.put('/updateService/:id',[mdAuth.ensureAuth], serviceController.updateService);
api.delete('/deleteService/:id',[mdAuth.ensureAuth],serviceController.deleteService);
api.get('/getService/:id',[mdAuth.ensureAuth],serviceController.getService);
api.get('/getServices/:id',[mdAuth.ensureAuth],serviceController.getServices);
api.get('/getServicesGeneral', mdAuth.ensureAuth, serviceController.getServicesGeneral);

module.exports = api;