'use strict'

const typeController = require('../controllers/typeEvent.controller');
const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');

api.post('/newTypeEvent', [mdAuth.ensureAuth], typeController.newTypeEvent);
api.get('/getType/:id', mdAuth.ensureAuth, typeController.getType);
api.get('/getTypes', mdAuth.ensureAuth, typeController.getTypes);

module.exports = api;