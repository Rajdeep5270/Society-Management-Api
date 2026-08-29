const ResidentService = require("../services/resident.service");
const { MSG } = require("../utils/msg");
const { errorResponse, successResponse } = require("../utils/response");

const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { residentMessage } = require("../utils/residentMsg");

const residentService = new ResidentService();

// create resident
module.exports.createResident = async (req, res) => {
    if (!req.admin) return res.json(errorResponse(401, true, MSG.ADMIN_UNAUTHORIZED));

    const resident = await residentService.findOneResident({ email: req.body.email });

    if (resident) return res.json(errorResponse(400, true, residentMessage.RESIDENT_ALREADY_EXISTS));

    const password = req.body.password;

    req.body.password = await bcrypt.hash(req.body.password, 11);

    req.body.created_at = moment().format('MM/DD/YYYY, h:mm:ss a');
    req.body.updated_at = moment().format('MM/DD/YYYY, h:mm:ss a');

    const newResident = await residentService.createResident(req.body);

    if (!newResident) return res.json(errorResponse(400, true, residentMessage.RESIDENT_CREATION_FAILED));

    return res.json(successResponse(201, false, residentMessage.RESIDENT_CREATED_SUCCESS, newResident));
}

// Resident Login
module.exports.login = async (req, res) => {
    try {
        const resident = await residentService.findOneResident({
            email: req.body.email
        });

        if (!resident) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_INVALID_CREDENTIALS
                )
            );
        }

        if (
            resident.login_attempt_expire_time &&
            Date.now() > resident.login_attempt_expire_time
        ) {
            resident.login_attempt = 0;

            await residentService.updateResident(
                resident._id,
                {
                    login_attempt: 0,
                    login_attempt_expire_time: null
                }
            );
        }

        resident.login_attempt++;

        if (resident.login_attempt > 3) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_LOGIN_ATTEMPT_REACHED
                )
            );
        }

        await residentService.updateResident(
            resident._id,
            {
                login_attempt: resident.login_attempt,
                login_attempt_expire_time:
                    Date.now() + 1000 * 60 * 60
            }
        );

        const isPasswordMatched = await bcrypt.compare(
            req.body.password,
            resident.password
        );

        if (!isPasswordMatched) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_INVALID_CREDENTIALS
                )
            );
        }

        const payload = {
            id: resident._id,
            role: "resident"
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );

        await residentService.updateResident(
            resident._id,
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
                residentMessage.RESIDENT_LOGIN_SUCCESS,
                token
            )
        );

    } catch (err) {
        console.log(err);

        return res.json(
            errorResponse(
                500,
                true,
                residentMessage.INTERNAL_SERVER_ERROR
            )
        );
    }
};

// Forgot Password
module.exports.forgotPassword = async (req, res) => {
    try {
        const resident = await residentService.findOneResident({
            email: req.body.email
        });

        if (!resident) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_NOT_FOUND
                )
            );
        }

        if (
            resident.OTP_attempt_expire_time &&
            Date.now() > resident.OTP_attempt_expire_time
        ) {
            resident.OTP_attempt = 0;

            await residentService.updateResident(
                resident._id,
                {
                    OTP: 0,
                    OTP_attempt: 0,
                    OTP_attempt_expire_time: null
                }
            );
        }

        if (resident.OTP_attempt > 2) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_OTP_SEND_ATTEMPT_REACHED
                )
            );
        }

        const OTP = crypto.randomInt(100000, 1000000);

        const hashedOTP = await bcrypt.hash(
            OTP.toString(),
            11
        );

        resident.OTP_attempt++;

        const updatedData =
            await residentService.updateResident(
                resident._id,
                {
                    OTP: hashedOTP,
                    OTP_attempt: resident.OTP_attempt,
                    OTP_attempt_expire_time:
                        Date.now() + 1000 * 60 * 60,
                    OTP_expire_time:
                        Date.now() + 1000 * 60 * 2
                }
            );

        if (!updatedData) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_OTP_SENT_FAILED
                )
            );
        }

        return res.json(
            successResponse(
                200,
                false,
                residentMessage.RESIDENT_OTP_SENT_SUCCESS
            )
        );

    } catch (err) {
        console.log(err);

        return res.json(
            errorResponse(
                500,
                true,
                residentMessage.INTERNAL_SERVER_ERROR
            )
        );
    }
};

// Verify OTP
module.exports.verifyOTP = async (req, res) => {
    try {
        const resident = await residentService.findOneResident({
            email: req.body.email
        });

        if (!resident) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_NOT_FOUND
                )
            );
        }

        if (
            resident.verify_OTP_attempt_expire_time &&
            Date.now() > resident.verify_OTP_attempt_expire_time
        ) {
            resident.verify_OTP_attempt = 0;

            await residentService.updateResident(
                resident._id,
                {
                    verify_OTP_attempt: 0,
                    verify_OTP_attempt_expire_time: null
                }
            );
        }

        resident.verify_OTP_attempt++;

        if (resident.verify_OTP_attempt > 3) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_OTP_ATTEMPT_REACHED
                )
            );
        }

        await residentService.updateResident(
            resident._id,
            {
                verify_OTP_attempt:
                    resident.verify_OTP_attempt,
                verify_OTP_attempt_expire_time:
                    Date.now() + 1000 * 60 * 60
            }
        );

        if (Date.now() > resident.OTP_expire_time) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_OTP_EXPIRED
                )
            );
        }

        const isOTPMatched = await bcrypt.compare(
            req.body.OTP.toString(),
            resident.OTP
        );

        if (!isOTPMatched) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_INVALID_OTP
                )
            );
        }

        await residentService.updateResident(
            resident._id,
            {
                OTP: 0,
                OTP_expire_time: null,
                verify_OTP_attempt: 0,
                verify_OTP_attempt_expire_time: null,
                isVerified: true
            }
        );

        return res.json(
            successResponse(
                200,
                false,
                residentMessage.RESIDENT_OTP_VERIFIED
            )
        );

    } catch (err) {
        console.log(err);

        return res.json(
            errorResponse(
                500,
                true,
                residentMessage.INTERNAL_SERVER_ERROR
            )
        );
    }
};

// Change Password
module.exports.changePassword = async (req, res) => {
    try {
        const resident = await residentService.findOneResident({
            email: req.body.email
        });

        if (!resident) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_NOT_FOUND
                )
            );
        }

        if (!resident.isVerified) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_OTP_VERIFICATION_REQUIRED
                )
            );
        }

        let {
            password,
            conf_password
        } = req.body;

        if (password !== conf_password) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_PASSWORD_MISMATCH
                )
            );
        }

        conf_password = await bcrypt.hash(
            conf_password,
            11
        );

        const updatedPassword =
            await residentService.updateResident(
                resident._id,
                {
                    password: conf_password,
                    isVerified: false
                }
            );

        if (!updatedPassword) {
            return res.json(
                errorResponse(
                    400,
                    true,
                    residentMessage.RESIDENT_PASSWORD_RESET_FAILED
                )
            );
        }

        return res.json(
            successResponse(
                200,
                false,
                residentMessage.RESIDENT_PASSWORD_RESET_SUCCESS
            )
        );

    } catch (err) {
        console.log(err);

        return res.json(
            errorResponse(
                500,
                true,
                residentMessage.INTERNAL_SERVER_ERROR
            )
        );
    }
};