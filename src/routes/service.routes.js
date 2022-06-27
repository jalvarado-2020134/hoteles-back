'use strict'

const express = require('express');
const api  = express.Router();
const mdAuth = require('../services/authenticated');
const serviceController = require('../controllers/service.controller');

api.post('/newService', [mdAuth.ensureAuth, mdAuth.isManager], serviceController.newService);
api.put('/updateService/:id',[mdAuth.ensureAuth,mdAuth.isManager], serviceController.updateService);
api.delete('/deleteService/:id',[mdAuth.ensureAuth,mdAuth.isManager],serviceController.deleteService);
api.get('/getService/:id'[mdAuth.ensureAuth,mdAuth.isManager],serviceController.getService);
api.get('/getServices',[mdAuth.ensureAuth,mdAuth.isManager],serviceController.getServices);