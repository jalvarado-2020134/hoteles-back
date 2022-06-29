'use strict'

const express = require('express');
const api  = express.Router();
const mdAuth = require('../services/authenticated');
const serviceController = require('../controllers/service.controller');

api.post('/newService', [mdAuth.ensureAuth, mdAuth.isAdmin], serviceController.newService);
api.put('/updateService/:id',[mdAuth.ensureAuth,mdAuth.isAdmin], serviceController.updateService);
api.delete('/deleteService/:id',[mdAuth.ensureAuth,mdAuth.isAdmin],serviceController.deleteService);
api.get('/getService/:id',[mdAuth.ensureAuth],serviceController.getService);
api.get('/getServices',[mdAuth.ensureAuth],serviceController.getServices);

module.exports = api;