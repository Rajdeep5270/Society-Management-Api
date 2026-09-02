const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI, {
}).then(() => {
    console.log('Database connected');
}).catch(err => {
    console.error('Database connection error:', err);
});   