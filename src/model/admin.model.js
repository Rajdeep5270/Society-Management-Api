const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    profile_image: {
        type: String,
    },
    profile_image_url: {
        type: String,
    },
    login_attempt: {
        type: Number,
        default: 0
    },
    login_attempt_expire_time: {
        type: Date,
        default: null
    },
    OTP: {
        type: String,
        // default: 0,
    },
    OTP_expire_time: {
        type: Date,
        default: null
    },
    OTP_attempt: {
        type: Number,
        default: 0,
    },
    OTP_attempt_expire_time: {
        type: Date,
        default: null
    },
    verify_OTP_attempt: {
        type: Number,
        default: 0,
    },
    verify_OTP_attempt_expire_time: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },
    created_at: {
        type: String,
    },
    updated_at: {
        type: String,
    },
    last_login: {
        type: String
    }
});

module.exports = mongoose.model('Admin', adminSchema, 'Admin');