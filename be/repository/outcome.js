import Outcome from "../model/Outcome.js"

const getAllOutcome = async () =>{
    try {
        const result = await Outcome.find();
        return result
    } catch (error) {
        throw new Error(error.message)
    }
}
export default {
    getAllOutcome
}