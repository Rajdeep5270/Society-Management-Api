const express = require('express');
const { login, forgotPassword, verifyOTP, changePassword, getAllResident, fetchSingleResident, createResident, activeOrInActiveResident, updateSingleResident, deleteResident, generateAccessToken, getCurrentUser } = require('../../../controller/resident.controller');
const { authMiddleware } = require('../../../middleware/auth.middleware');

const residentRoute = express.Router();

residentRoute.post('/login', login);
residentRoute.post('/forgot-password', forgotPassword);
residentRoute.post('/verify-otp', verifyOTP);
residentRoute.post('/change-password', changePassword);
residentRoute.post('/refresh-token', generateAccessToken)

residentRoute.use(authMiddleware);

// get all resident 
residentRoute.get('/', getAllResident);

// get current user 
residentRoute.get('/me', getCurrentUser);

// fetch single resident 
residentRoute.get('/:id', fetchSingleResident);

// create admin 
residentRoute.post('/', createResident);

// active or inactive resident 
residentRoute.put('/:id', activeOrInActiveResident);

// update resident 
residentRoute.patch('/:id', updateSingleResident);

// delete resident
residentRoute.delete('/:id', deleteResident);

module.exports = residentRoute;