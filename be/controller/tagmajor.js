import { TagMajorRepository } from "../repository/index.js";

const getAllMajor = async (req, res) => {
    try {
        const data = await TagMajorRepository.getAllMajor();
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default {
    getAllMajor,
};
