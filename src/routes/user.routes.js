'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const userController = require('../controllers/user.controller');


api.post('/login', userController.login);
api.post('/register', userController.register);
api.put('/update/:id', mdAuth.ensureAuth, userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth, userController.delete);

api.post('/newUser', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.newUser);
api.get('/getUser/:id', mdAuth.ensureAuth, userController.getUser);
api.get('/getUsers', [mdAuth.ensureAuth,mdAuth.isAdmin], userController.getUsers);
api.put('/update_Admin/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], userController.update_Admin);
api.delete('/delete_Admin/:id',[mdAuth.ensureAuth, mdAuth.isAdmin], userController.delete_Admin);
api.post('/search',[mdAuth.ensureAuth,mdAuth.isAdmin], userController.searchUser);

module.exports = api;