const mongoose = require('mongoose');


let connectionPromise;

module.exports = async function connectDatabase() {
    if (!process.env.MONGODBURI) {
        throw new Error('MONGODBURI environment variable is missing');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(process.env.MONGODBURI)
            .then(() => {
                console.log('Database is connected...');
                return mongoose.connection;
            })
            .catch((error) => {
                connectionPromise = undefined;
                console.error('Database is not connected...', error);
                throw error;
            });
    }

    return connectionPromise;
};

module.exports = connectDatabase;