const AdminService = require("../services/admin.service");
const ResidentService = require("../services/resident.service");
const { MSG } = require("../utils/msg");
const { errorResponse, successResponse } = require("../utils/response");


const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { sendRegisterAdminMail, forgotPasswordAdminMail } = require("../middleware/nodemailer.middleware");

const adminService = new AdminService();

module.exports.register = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email, isActive: true, isDelete: false });

        if (admin) return res.json(errorResponse(400, true, MSG.ADMIN_ALREADY_EXISTS));

        const password = req.body.password;

        req.body.password = await bcrypt.hash(req.body.password, 11);

        req.body.created_at = moment().format('MM/DD/YYYY, h:mm:ss a');
        req.body.updated_at = moment().format('MM/DD/YYYY, h:mm:ss a');

        const newAdmin = await adminService.registerAdmin(req.body);

        if (!newAdmin) return res.json(errorResponse(400, true, MSG.ADMIN_REGISTRATION_FAILED));

        const isSent = await sendRegisterAdminMail(req.body.first_name, req.body.last_name, req.body.email, password);

        if (!isSent) return res.json(errorResponse(400, true, MSG.ADMIN_OTP_SENT_FAILED));

        return res.json(successResponse(201, false, MSG.ADMIN_REGISTRATION_SUCCESS, newAdmin));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.login = async (req, res) => {

    try {
        const admin = await adminService.findOneAdmin({
            email: req.body.email,
            isActive: true,
            isDelete: false
        });

        if (!admin) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    MSG.ADMIN_INVALID_CREDENTIALS
                )
            );
        }

        // Reset login attempts if 1 hour has expired
        if (
            admin.login_attempt_expire_time &&
            Date.now() > admin.login_attempt_expire_time
        ) {
            admin.login_attempt = 0;

            await adminService.updateAdmin(
                admin._id,
                {
                    login_attempt: 0,
                    login_attempt_expire_time: null
                }
            );
        }

        // Increase login attempt
        admin.login_attempt++;

        // Maximum 3 attempts
        if (admin.login_attempt > 3) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    MSG.ADMIN_LOGIN_ATTEMPT_REACHED
                )
            );
        }

        await adminService.updateAdmin(
            admin._id,
            {
                login_attempt: admin.login_attempt,
                login_attempt_expire_time:
                    Date.now() + 1000 * 60 * 60
            }
        );

        // Check password
        const isPasswordMatched = await bcrypt.compare(
            req.body.password,
            admin.password
        );

        if (!isPasswordMatched) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    MSG.ADMIN_INVALID_CREDENTIALS
                )
            );
        }

        // JWT Payload
        const payload = {
            id: admin._id,
            role: "admin"
        };

        // Access Token
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "15m"
            }
        );

        // Refresh Token
        const refreshToken = jwt.sign(
            {
                id: admin._id,
                role: "admin"
            },
            process.env.JWT_REFRESH_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await adminService.updateAdmin(
            admin._id,
            {
                last_login: moment().format(
                    "MM/DD/YYYY, h:mm:ss a"
                ),
                login_attempt: 0,
                login_attempt_expire_time: null
            }
        );

        return res.json(
            successResponse(
                200,
                false,
                MSG.ADMIN_LOGIN_SUCCESS,
                accessToken
            )
        );

    } catch (err) {

        console.log(err);

        return res.json(
            errorResponse(
                500,
                true,
                MSG.INTERNAL_SERVER_ERROR
            )
        );
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email, isActive: true, isDelete: false });

        if (!admin) return res.json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        if (admin.OTP_attempt_expire_time && Date.now() > admin.OTP_attempt_expire_time) {
            admin.OTP_attempt = 0;
            await adminService.updateAdmin(admin._id, { OTP: 0, OTP_attempt: 0, OTP_attempt_expire_time: null });
        }

        if (admin.OTP_attempt > 2) return res.json(errorResponse(400, true, MSG.ADMIN_OTP_SEND_ATTEMPT_REACHED))

        const OTP = crypto.randomInt(100000, 1000000);

        const hashedOTP = await bcrypt.hash(OTP.toString(), 11);

        const isSent = await forgotPasswordAdminMail(OTP, admin.email);

        if (!isSent) return res.json(errorResponse(400, true, MSG.ADMIN_OTP_SENT_FAILED));

        admin.OTP_attempt++;

        const updatedData = await adminService.updateAdmin(admin._id, { OTP: hashedOTP, OTP_attempt: admin.OTP_attempt, OTP_attempt_expire_time: Date.now() + 1000 * 60 * 60, OTP_expire_time: Date.now() + 1000 * 60 * 10 });

        if (!updatedData) return res.json(errorResponse(400, true, MSG.ADMIN_OTP_SENT_FAILED));

        return res.json(successResponse(200, false, MSG.ADMIN_OTP_SENT_SUCCESS));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.verifyOTP = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email, isActive: true, isDelete: false });

        if (!admin) return res.json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        if (admin.verify_OTP_attempt_expire_time && Date.now() > admin.verify_OTP_attempt_expire_time) {
            admin.verify_OTP_attempt = 0;
            await adminService.updateAdmin(admin._id, { verify_OTP_attempt: 0, verify_OTP_attempt_expire_time: null });
        }

        admin.verify_OTP_attempt++;

        if (admin.verify_OTP_attempt > 3) return res.json(errorResponse(400, true, MSG.ADMIN_OTP_ATTEMPT_REACHED))

        await adminService.updateAdmin(admin._id, { verify_OTP_attempt: admin.verify_OTP_attempt, verify_OTP_attempt_expire_time: Date.now() + 1000 * 60 * 60 });

        if (Date.now() > admin.OTP_expire_time) return res.json(errorResponse(400, true, MSG.ADMIN_OTP_EXPIRED));

        const isOTPMatched = await bcrypt.compare(req.body.OTP.toString(), admin.OTP);

        if (!isOTPMatched) return res.json(errorResponse(400, true, MSG.ADMIN_INVALID_OTP));

        await adminService.updateAdmin(admin._id, { OTP: 0, OTP_expire_time: null, verify_OTP_attempt: 0, verify_OTP_attempt_expire_time: null, isVerified: true });

        return res.json(successResponse(200, false, MSG.ADMIN_OTP_VERIFIED));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        const admin = await adminService.findOneAdmin({ email: req.body.email, isActive: true, isDelete: false });

        if (!admin) return res.json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        if (!admin.isVerified) return res.json(errorResponse(400, true, MSG.ADMIN_OTP_VERIFICATION_REQUIRED))

        let { password, conf_password } = req.body;

        if (password !== conf_password) return res.json(errorResponse(400, true, MSG.ADMIN_PASSWORD_MISMATCH));

        conf_password = await bcrypt.hash(conf_password, 11);

        const updatedPassword = await adminService.updateAdmin(admin._id, { password: conf_password, isVerified: false });

        if (!updatedPassword) return res.json(errorResponse(400, true, MSG.ADMIN_PASSWORD_RESET_FAILED));

        return res.json(successResponse(200, false, MSG.ADMIN_PASSWORD_RESET_SUCCESS));
    } catch (err) {
        console.log(err);
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.generateAccessToken = async (req, res) => {
    try {

        // Get Access Token from Header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .json(errorResponse(
                    401,
                    true,
                    MSG.ADMIN_TOKEN_REQUIRED
                ));
        }

        const accessToken = authHeader.split(" ")[1];

        // Decode Access Token
        const decodedAccessToken = jwt.decode(accessToken);

        if (!decodedAccessToken) {
            return res
                .json(errorResponse(
                    401,
                    true,
                    MSG.ADMIN_TOKEN_INVALID
                ));
        }

        // Required payload values
        if (!decodedAccessToken.id || !decodedAccessToken.role) {
            return res
                .json(errorResponse(
                    401,
                    true,
                    MSG.ADMIN_TOKEN_INVALID
                ));
        }

        // Verify Access Token Signature
        let verifiedAccessToken;

        try {
            verifiedAccessToken = jwt.verify(
                accessToken,
                process.env.JWT_SECRET_KEY,
                {
                    ignoreExpiration: true
                }
            );
        } catch (err) {
            console.log(err);
            return res
                .json(errorResponse(
                    401,
                    true,
                    MSG.ADMIN_TOKEN_VERIFICATION_FAILED
                ));
        }

        // Get Refresh Token from Cookie
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res
                .json(errorResponse(
                    401,
                    true,
                    MSG.REFRESH_TOKEN_REQUIRED
                ));
        }

        // Verify Refresh Token
        const decodedRefreshToken = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY
        );

        // Match Access Token and Refresh Token
        if (
            verifiedAccessToken.id !== decodedRefreshToken.id ||
            verifiedAccessToken.role !== decodedRefreshToken.role
        ) {
            return res

                .json(errorResponse(
                    401,
                    true,
                    MSG.REFRESH_TOKEN_INVALID
                ));
        }

        // Generate New Access Token
        const newAccessToken = jwt.sign(
            {
                id: decodedRefreshToken.id,
                role: decodedRefreshToken.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "15m"
            }
        );

        return res
            .json(successResponse(
                200,
                false,
                MSG.REFRESH_TOKEN_GENERATED,
                {
                    accessToken: newAccessToken
                }
            ));

    } catch (err) {

        console.log(err);

        if (err.name === "TokenExpiredError") {
            return res

                .json(errorResponse(
                    401,
                    true,
                    MSG.REFRESH_TOKEN_EXPIRED
                ));
        }

        if (err.name === "JsonWebTokenError") {
            return res

                .json(errorResponse(
                    401,
                    true,
                    MSG.REFRESH_TOKEN_INVALID
                ));
        }

        return res
            .json(errorResponse(
                500,
                true,
                MSG.INTERNAL_SERVER_ERROR
            ));
    }
};

module.exports.getAllAdmin = async (req, res) => {
    try {
        if (!req.admin) return res.json(404, true, MSG.ADMIN_UNAUTHORIZED);

        const allAdmin = await adminService.fetchAllAdmin({ isActive: true, isDelete: false });

        if (!allAdmin) return res.json(errorResponse(400, true, MSG.ADMIN_FETCH_ALL_FAILED));

        return res.json(successResponse(200, false, MSG.ADMIN_FETCH_ALL_SUCCESS, allAdmin));
    } catch (err) {
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.getSingleAdmin = async (req, res) => {
    try {
        if (!req.admin) return res.json(404, true, MSG.ADMIN_UNAUTHORIZED);

        const id = req.params.id;

        const admin = await adminService.findOneAdmin({ _id: id, isActive: true, isDelete: false });

        if (!admin) return res.json(errorResponse(400, true, MSG.ADMIN_FETCH_SINGLE_FAILED));

        return res.json(successResponse(200, false, MSG.ADMIN_FETCH_SINGLE_SUCCESS, admin));
    } catch (err) {
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.activeOrInactiveAdmin = async (req, res) => {
    try {
        if (!req.admin) return res.json(404, true, MSG.ADMIN_UNAUTHORIZED);

        const id = req.params.id;

        const admin = await adminService.findOneAdmin({ _id: id, isDelete: false });

        if (!admin) return res.json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        const updateAdmin = await adminService.updateAdmin(id, { isActive: !admin.isActive });

        if (!updateAdmin) return res.json(errorResponse(400, true, MSG.ADMIN_UPDATE_FAILED));

        return res.json(successResponse(200, false, `${updateAdmin.first_name} ${updateAdmin.last_name}  is ${updateAdmin.isActive ? 'active' : 'inactive'}`));
    } catch (err) {
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.updateSingleAdmin = async (req, res) => {
    try {
        if (!req.admin) return res.json(404, true, MSG.ADMIN_UNAUTHORIZED);

        const data = req.body;
        const id = req.params.id;

        const admin = await adminService.findOneAdmin({ _id: id, isActive: true, isDelete: false });

        if (!admin) return res.json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        req.body.updated_at = moment().format('MM/DD/YYYY, h:mm:ss a');

        const updatedAdmin = await adminService.updateAdmin(id, data);

        if (!updatedAdmin) return res.json(errorResponse(400, true, MSG.ADMIN_UPDATED_SUCCESS));

        return res.json(successResponse(200, false, MSG.ADMIN_UPDATED_SUCCESS, updatedAdmin));
    } catch (err) {
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}

module.exports.deleteSingleAdmin = async (req, res) => {
    try {
        if (!req.admin) return res.json(404, true, MSG.ADMIN_UNAUTHORIZED);

        const id = req.params.id;

        const admin = await adminService.findOneAdmin({ _id: id, isActive: true, isDelete: false });

        if (!admin) return res.json(errorResponse(400, true, MSG.ADMIN_NOT_FOUND));

        const deletedAdmin = await adminService.updateAdmin(id, { isActive: !admin.isActive, isDelete: !admin.isDelete });

        if (!deletedAdmin) return res.json(400, true, MSG.ADMIN_DELETION_FAILED);

        return res.json(successResponse(200, false, MSG.ADMIN_DELETED_SUCCESS, deletedAdmin));
    } catch (err) {
        return res.json(errorResponse(500, true, MSG.INTERNAL_SERVER_ERROR));
    }
}