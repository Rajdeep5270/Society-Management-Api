const express = require('express');

const route = express.Router();

// auth route 
route.use('/auth', require('./auth/auth.route'));

// admin api 
route.use('/admin', require('./auth/admin/admin.route'));

module.exports = route;