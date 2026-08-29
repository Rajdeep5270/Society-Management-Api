require('dotenv').config();
const express = require('express');
require('./config/db.config');

const cors = require('cors');

const app = express();

app.use(cors);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api will go to index.js in routes
app.use('/api', require('./routes/index.route'));

app.listen(process.env.PORT, err => {
    if (err) {
        console.log("Server is not started...");
        return;
    }

    console.log("Server is started...");
});