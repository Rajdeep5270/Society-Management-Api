const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI).then(() => {
    console.log("Database is connected...");
}).catch(err => {
    console.log("Database is not connected...", err);
});    