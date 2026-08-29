const AdminService = require("../services/admin.service");
const ResidentService = require("../services/resident.service");
const { MSG } = require("../utils/msg");
const { errorResponse, successResponse } = require("../utils/response");


const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { sendRegisterAdminMail } = require("../middleware/nodemailer.middleware");
const { error } = require("console");
const { residentMessage } = require("../utils/residentMsg");

const adminService = new AdminService();
const residentService = new ResidentService();

module.exports.register = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email });

        if (admin) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_ALREADY_EXISTS));

        const password = req.body.password;

        req.body.password = await bcrypt.hash(req.body.password, 11);

        req.body.created_at = moment().format('MM/DD/YYYY, h:mm:ss a');
        req.body.updated_at = moment().format('MM/DD/YYYY, h:mm:ss a');

        const newAdmin = await adminService.registerAdmin(req.body);

        if (!newAdmin) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_REGISTRATION_FAILED));

        sendRegisterAdminMail(req.body.first_name, req.body.last_name, req.body.email, password);

        return res.status(201).json(successResponse(201, false, MSG.ADMIN_REGISTRATION_SUCCESS, newAdmin));
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.login = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email });

        if (!admin) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_INVALID_CREDENTIALS));

        if (admin.login_attempt_expire_time && Date.now() > admin.login_attempt_expire_time) {
            admin.login_attempt = 0;
            await adminService.updateAdmin(admin._id, { login_attempt: 0, login_attempt_expire_time: null })
        };

        admin.login_attempt++;

        if (admin.login_attempt > 3) {
            return res.status(400).json(errorResponse(400, true, MSG.ADMIN_LOGIN_ATTEMPT_REACHED));
        }

        await adminService.updateAdmin(admin._id, { login_attempt: admin.login_attempt, login_attempt_expire_time: Date.now() + 1000 * 60 * 60 });

        const isPasswordMatched = await bcrypt.compare(req.body.password, admin.password);

        if (!isPasswordMatched) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_INVALID_CREDENTIALS));

        const payload = {
            id: admin._id,
            role: "admin"
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        await adminService.updateAdmin(admin._id, { last_login: moment().format('MM/DD/YYYY, h:mm:ss a'), login_attempt: 0, login_attempt_expire_time: null });

        return res.status(200).json(successResponse(200, false, MSG.ADMIN_LOGIN_SUCCESS, token));
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email });

        if (!admin) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        if (admin.OTP_attempt_expire_time && Date.now() > admin.OTP_attempt_expire_time) {
            admin.OTP_attempt = 0;
            await adminService.updateAdmin(admin._id, { OTP: 0, OTP_attempt: 0, OTP_attempt_expire_time: null });
        }

        if (admin.OTP_attempt > 2) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_OTP_SEND_ATTEMPT_REACHED))

        const OTP = crypto.randomInt(100000, 1000000);

        const hashedOTP = await bcrypt.hash(OTP.toString(), 11);

        admin.OTP_attempt++;

        const updatedData = await adminService.updateAdmin(admin._id, { OTP: hashedOTP, OTP_attempt: admin.OTP_attempt, OTP_attempt_expire_time: Date.now() + 1000 * 60 * 60, OTP_expire_time: Date.now() + 1000 * 60 * 2 });

        if (!updatedData) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_OTP_SENT_FAILED));

        return res.status(200).json(successResponse(200, false, MSG.ADMIN_OTP_SENT_SUCCESS));
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.verifyOTP = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email });

        if (!admin) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        if (admin.verify_OTP_attempt_expire_time && Date.now() > admin.verify_OTP_attempt_expire_time) {
            admin.verify_OTP_attempt = 0;
            await adminService.updateAdmin(admin._id, { verify_OTP_attempt: 0, verify_OTP_attempt_expire_time: null });
        }

        admin.verify_OTP_attempt++;

        if (admin.verify_OTP_attempt > 3) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_OTP_ATTEMPT_REACHED))

        await adminService.updateAdmin(admin._id, { verify_OTP_attempt: admin.verify_OTP_attempt, verify_OTP_attempt_expire_time: Date.now() + 1000 * 60 * 60 });

        if (Date.now() > admin.OTP_expire_time) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_OTP_EXPIRED));

        const isOTPMatched = await bcrypt.compare(req.body.OTP.toString(), admin.OTP);

        if (!isOTPMatched) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_INVALID_OTP));

        await adminService.updateAdmin(admin._id, { OTP: 0, OTP_expire_time: null, verify_OTP_attempt: 0, verify_OTP_attempt_expire_time: null, isVerified: true });

        return res.status(200).json(successResponse(200, false, MSG.ADMIN_OTP_VERIFIED));
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email });

        if (!admin) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        if (!admin.isVerified) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_OTP_VERIFICATION_REQUIRED))

        let { password, conf_password } = req.body;

        if (password !== conf_password) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_PASSWORD_MISMATCH));

        conf_password = await bcrypt.hash(conf_password, 11);

        const updatedPassword = await adminService.updateAdmin(admin._id, { password: conf_password, isVerified: false });

        if (!updatedPassword) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_PASSWORD_RESET_FAILED));

        return res.status(200).json(successResponse(200, false, MSG.ADMIN_PASSWORD_RESET_SUCCESS));
    } catch (err) {
        console.log(err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

// fetch all resident 
module.exports.getAllResident = async (req, res) => {
    try {
        if (!req.admin) return res.status(404).json(errorResponse(404, true, MSG.ADMIN_UNAUTHORIZED));

        const allResidents = await residentService.findAllll({ isActive: true, isDelete: false });

        if (!allResidents) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENTS_FETCH_FAILED));

        return res.status(200).json(successResponse(200, false, residentMessage.RESIDENTS_FETCH_SUCCESS, allResidents));
    } catch (err) {
        console.log("Get all resident error : ", err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

// fetch single resident 
module.exports.fetchSingleResident = async (req, res) => {
    try {
        if (!req.admin) return res.status(404).json(errorResponse(404, true, MSG.ADMIN_UNAUTHORIZED));

        const resident = await residentService.findOneResident({ _id: req.params.id, isActive: true, isDelete: false });

        if (!resident) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENT_FETCH_FAILED));

        return res.status(200).json(successResponse(200, false, residentMessage.RESIDENT_FETCH_SUCCESS, resident));
    } catch (err) {
        console.log("Fetch single resident error : ", err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.updateSingleResident = async (req, res) => {
    try {
        if (!req.admin) return res.status(404).json(errorResponse(404, true, MSG.ADMIN_UNAUTHORIZED));

        const resident = await residentService.findOneResident({ _id: req.params.id, isActive: true, isDelete: false });

        if (!resident) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENT_FETCH_FAILED));

        req.body.updated_at = moment().format('MM/DD/YYYY, h:mm:ss a');

        const updatedResident = await residentService.updateResident(req.params.id, req.body);

        if (!updatedResident) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENT_UPDATE_FAILED));

        return res.status(200).json(successResponse(200, false, residentMessage.RESIDENT_UPDATED_SUCCESS, updatedResident));
    } catch (err) {
        console.log("Fetch single resident error : ", err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.activeOrInActiveResident = async (req, res) => {
    try {
        if (!req.admin) return res.status(404).json(errorResponse(404, true, MSG.ADMIN_UNAUTHORIZED));

        const resident = await residentService.findOneResident({ _id: req.params.id, isDelete: false });

        if (!resident) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENT_FETCH_FAILED));

        const updatedResident = await residentService.updateResident(req.params.id, { isActive: !resident.isActive });

        if (!updatedResident) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENT_UPDATE_FAILED));

        return res.status(200).json(successResponse(200, false, `${updatedResident.first_name} ${updatedResident.last_name}  is ${updatedResident.isActive ? 'active' : 'inactive'}`));
    } catch (err) {
        console.log("Active or inactive resident error : ", err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.deleteResident = async (req, res) => {
    try {
        if (!req.admin) return res.status(404).json(errorResponse(404, true, MSG.ADMIN_UNAUTHORIZED));

        const resident = await residentService.findOneResident({ _id: req.params.id, isActive: true, isDelete: false });

        if (!resident) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENT_FETCH_FAILED));

        const deletedResident = await residentService.updateResident(req.params.id, { isActive: !resident.isActive, isDelete: !resident.isDelete });

        if (!deletedResident) return res.status(400).json(errorResponse(400, true, residentMessage.RESIDENT_DELETION_FAILED));

        return res.status(200).json(successResponse(200, false, residentMessage.RESIDENT_DELETED_SUCCESS));
    } catch (err) {
        console.log("Active or inactive resident error : ", err);
        return res.status(500).json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}