'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const eventController = require('../controllers/events.controller');

api.post('/newEvent', mdAuth.ensureAuth, eventController.newEvent);
api.put('/updateEvent/:id', eventController.updateEvent);
api.delete('/deleteEvent/:id', mdAuth.ensureAuth, eventController.deleteEvent);
api.get('/getEvent/:id', mdAuth.ensureAuth, eventController.getEvent);
api.get('/getEvents', mdAuth.ensureAuth, eventController.getEvents);

module.exports = api;