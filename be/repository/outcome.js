import Outcome from "../model/Outcome.js"

const getAllOutcome = async () =>{
    try {
        const result = await Outcome.find();
        return result
    } catch (error) {
        throw new Error(error.message)
    }
}
const getOutcome = async () =>{
    try {
        const result = await Outcome.find().sort({ index: 1 });
        return result
    } catch (error) {
        throw new Error(error.message)
    }
}
const createOutcome = async ({title, description, gradingCriteria}) => {
    try {
        const formattedGradingCriteria = gradingCriteria.map((item) => ({
            description: item,
          }));
        const totalItems = await Outcome.countDocuments();
        const result = await Outcome.create({title, description, GradingCriteria: formattedGradingCriteria, index: totalItems + 1})
        return result;
    } catch (error) {
        throw new Error(error.message)
    }
}
export default {
    getAllOutcome, 
    createOutcome,
    getOutcome
}