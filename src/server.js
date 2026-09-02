require('dotenv').config();
const express = require('express');
const connectDatabase = require('./config/db.config');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        res.status(503).json({ message: 'Database is unavailable' });
    }
});

// api will go to index.js in routes
app.use('/api', require('./routes/index.route'));

module.exports = app;