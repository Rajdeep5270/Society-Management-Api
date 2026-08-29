const express = require('express');
const { register, login, forgotPassword, verifyOTP, changePassword, getAllResident, fetchSingleResident, updateSingleResident, activeOrInActiveResident, deleteResident } = require('../../../controller/admin.controller');
const { authMiddleware } = require('../../../middleware/auth.middleware');
const { createResident } = require('../../../controller/resident.controller');

const adminRoute = express.Router();

adminRoute.post('/register', register);
adminRoute.post('/login', login);
adminRoute.post('/forgot_password', forgotPassword);
adminRoute.post('/verify_OTP', verifyOTP);
adminRoute.post('/change_password', changePassword);

// authentication middleware 
adminRoute.use(authMiddleware);

// create admin 
adminRoute.post('/create-resident', createResident);

// get all resident 
adminRoute.get('/', getAllResident);

// fetch single resident 
adminRoute.get('/:id', fetchSingleResident);

// update resident 
adminRoute.patch('/:id', updateSingleResident);

// active or inactive resident 
adminRoute.put('/:id', activeOrInActiveResident);

adminRoute.delete('/:id', deleteResident);

module.exports = adminRoute;