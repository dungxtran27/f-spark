import { ClassRepository } from "../repository/index.js";

const pinClasswork = async (req, res) => {
    try {
        const { classId, classworkId } = req.body;
        if (!classId || !classworkId) {
            return res.status(400).json({ message: "Id is required" });
        }
        const pinClasswork = await ClassRepository.pinClasswork(classworkId, classId);
        return res.status(200).json({ data: pinClasswork });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export default {
    pinClasswork,
};
