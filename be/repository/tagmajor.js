import TagMajor from "../model/TagMajor.js";

const getAllMajor = async () => {
    try {
        const data = await TagMajor.find();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    getAllMajor
};