require('dotenv').config();

const express = require('express');
require('./config/db.config');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    // 'https://your-frontend-domain.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {

        // Postman ya server-to-server requests ke liye
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(
            new Error('Not allowed by CORS')
        );
    },
    credentials: true,
    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
}));

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// API routes
app.use('/api', require('./routes/index.route'));

// app.listen(process.env.PORT, (err) => {
//     if (err) {
//         console.log("Server is not started", err);
//         return;
//     }

//     console.log("Server is started");
// });

module.exports = app;