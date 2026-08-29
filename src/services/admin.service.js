const Admin = require('../model/admin.model');

module.exports = class AdminService {
    async registerAdmin(data) {
        try {
            return await Admin.create(data);
        } catch (err) {
            console.log("Admin registration error : ", err);
        }
    }

    async findOneAdmin(data) {
        try {
            return await Admin.findOne(data);
        } catch (err) {
            console.log("Find admin error : ", err);
        }
    }

    async updateAdmin(id, data) {
        try {
            return await Admin.findByIdAndUpdate(id, data, { new: true });
        } catch (err) {
            console.log("Update admin error : ", err);
        }
    }

    async findAdminById(id) {
        try {
            return await Admin.findById(id);
        } catch (err) {
            console.log("Find admin by id error : ", err);
        }
    }
};