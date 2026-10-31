const express = require('express');
const { register, login, forgotPassword, verifyOTP, changePassword, getAllAdmin, getSingleAdmin, activeOrInactiveAdmin, updateSingleAdmin, deleteSingleAdmin, generateRefreshToken, generateAccessToken, getCurrentUser } = require('../../../controller/admin.controller');
const { authMiddleware } = require('../../../middleware/auth.middleware');

const adminRoute = express.Router();

adminRoute.post('/login', login);
adminRoute.post('/forgot-password', forgotPassword);
adminRoute.post('/verify-OTP', verifyOTP);
adminRoute.post('/change-password', changePassword);
adminRoute.post('/refresh-token', generateAccessToken);

// authentication middleware 
adminRoute.use(authMiddleware);

// fetch all admin 
adminRoute.get('/', getAllAdmin);

adminRoute.get('/me', getCurrentUser);

// get single admin 
adminRoute.get('/:id', getSingleAdmin);

// register admin 
adminRoute.post('/', register);

// active or inactive admin 
adminRoute.put('/:id', activeOrInactiveAdmin);

// update single admin 
adminRoute.patch('/:id', updateSingleAdmin);

// delete admin
adminRoute.delete('/:id', deleteSingleAdmin);

module.exports = adminRoute;