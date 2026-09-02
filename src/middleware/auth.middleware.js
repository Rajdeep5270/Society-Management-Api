const AdminService = require("../services/admin.service");
const ResidentService = require("../services/resident.service");
const { MSG } = require("../utils/msg");
const { errorResponse } = require("../utils/response");

const adminService = new AdminService();
const residentService = new ResidentService();

const jwt = require("jsonwebtoken");

module.exports.authMiddleware = async (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json(
                errorResponse(
                    401,
                    true,
                    MSG.ADMIN_TOKEN_REQUIRED
                )
            );
        }

        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json(
                errorResponse(
                    401,
                    true,
                    MSG.ADMIN_TOKEN_INVALID
                )
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        let data;

        if (decoded.role === "admin") {

            data = await adminService.findOneAdmin({
                _id: decoded.id,
                isActive: true,
                isDelete: false
            });

            if (data) {
                req.admin = data;
            }
        }

        if (decoded.role === "resident") {

            data = await residentService.findOneResident({
                _id: decoded.id,
                isActive: true,
                isDelete: false
            });

            if (data) {
                req.resident = data;
            }
        }

        if (!data) {
            return res.status(401).json(
                errorResponse(
                    401,
                    true,
                    MSG.ADMIN_TOKEN_INVALID
                )
            );
        }

        next();

    } catch (err) {

        console.log("Auth middleware error:", err.message);

        return res.status(401).json(
            errorResponse(
                401,
                true,
                MSG.ADMIN_TOKEN_INVALID
            )
        );
    }
};