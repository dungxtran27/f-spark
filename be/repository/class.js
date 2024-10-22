import Class from "../model/Class.js";

const pinClasswork = async (classworkId, classId) => {
    try {
        const classData = await Class.findById(classId).select('_id pin');
        if (!classData) {
            throw new Error("Class not found");
        }
        if (classData.pin && classData.pin.toString() === classworkId) {
            throw new Error("Classwork is already pinned");
        }
        const updatePinClass = await Class.findOneAndUpdate(
            { _id: classId },
            { pin: classworkId },
            { new: true }
        );
        return updatePinClass;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    pinClasswork,

};
