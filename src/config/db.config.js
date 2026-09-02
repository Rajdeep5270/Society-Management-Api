const mongoose = require('mongoose');

const connectDatabase = async () => {
    if (!process.env.MONGODBURI) {
        console.log('MONGODBURI environment variable is missing');
        return;
    }

    await mongoose.connect(process.env.MONGODBURI);
    console.log('Database is connected...');
};

module.exports = connectDatabase;