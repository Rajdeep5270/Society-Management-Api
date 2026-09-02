const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null,
    };
}

const connectDB = async () => {
    // Already connected
    if (cached.conn) {
        return cached.conn;
    }

    // Connection already in progress
    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGOBBURI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;

        console.log("MongoDB connected successfully");

        return cached.conn;
    } catch (error) {
        cached.promise = null;

        console.error("MongoDB connection error:", error.message);

        throw error;
    }
};

module.exports = connectDB;