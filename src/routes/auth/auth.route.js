const express = require('express');

const authRoute = express.Router();

authRoute.use('/admin', require('./admin/admin.route'));

authRoute.use('/resident', require('./resident/resident.route'));

module.exports = authRoute;