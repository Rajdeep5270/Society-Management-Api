const express = require('express');
const { login, forgotPassword, verifyOTP, changePassword } = require('../../../controller/resident.controller');

const residentRoute = express.Router();

residentRoute.post('/login', login);
residentRoute.post('/forgot-password', forgotPassword);
residentRoute.post('/verify-otp', verifyOTP);
residentRoute.post('/change-password', changePassword);

module.exports = residentRoute;