require('dotenv').config();
const express = require('express');
require('./config/db.config');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors({
    origin: [
        process.env.ORIGIN,
        process.env.LOCAL_ORIGIN
    ],
    credentials: true
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// api will go to index.js in routes
app.use('/api', require('./routes/index.route'));

// app.listen(process.env.PORT, (err) => {
//     if (err) {
//         console.log("Server is not started", err);
//         return;
//     }

//     console.log("Server is started");
// })

module.exports = app;