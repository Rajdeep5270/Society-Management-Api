const AdminService = require("../services/admin.service");
const ResidentService = require("../services/resident.service");
const { MSG } = require("../utils/msg");
const { errorResponse } = require("../utils/response");

const adminService = new AdminService();
const residentService = new ResidentService();

const jwt = require('jsonwebtoken');

module.exports.authMiddleware = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) return res.status(400).json(errorResponse(400, true, MSG.ADMIN_TOKEN_REQUIRED));

    token = token.slice(7, token.length);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        let data;

        // console.log(decoded);
        if (decoded.role === "admin") {
            data = await adminService.findOneAdmin({ _id: decoded.id, isActive: true, isDelete: false });

            req.admin = data;
        }

        if (decoded.role === "resident") {
            data = await residentService.findOneResident({ _id: decoded.id, isActive: true, isDelete: false });

            req.resident = data;
        }

        if (!data) return res.status(401).json(errorResponse(401, true, MSG.ADMIN_TOKEN_INVALID));

        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json(errorResponse(400, true, MSG.ADMIN_TOKEN_INVALID));
    }
}