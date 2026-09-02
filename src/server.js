require('dotenv').config();
const express = require('express');
require('./config/db.config');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

// api will go to index.js in routes
app.use('/api', require('./routes/index.route'));

module.exports = app;