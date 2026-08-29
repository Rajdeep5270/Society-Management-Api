const Resident = require('../model/resident.model');

module.exports = class ResidentService {
    async createResident(data) {
        try {
            return await Resident.create(data);
        } catch (err) {
            console.log("Resident registration error : ", err);
        }
    }

    async findOneResident(data) {
        try {
            return await Resident.findOne(data);
        } catch (err) {
            console.log("Find resident error : ", err);
        }
    }

    async findAll(data) {
        try {
            return await Resident.find(data).select('_id first_name last_name number house_no profile_image profile_image_url isActive isDelete');
        } catch (err) {
            console.log("Find all resident error : ", err);
        }
    }

    async updateResident(id, data) {
        try {
            return await Resident.findByIdAndUpdate(
                id,
                data,
                { returnDocument: "after" }
            );
        } catch (err) {
            console.log("Update resident error : ", err);
        }
    }

    async findResidentById(id) {
        try {
            return await Resident.findById(id);
        } catch (err) {
            console.log("Find resident by id error : ", err);
        }
    }
}