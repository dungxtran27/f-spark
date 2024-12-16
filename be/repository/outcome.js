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
const findById = async (outcomeId) =>{
    try {
        const result = await Outcome.findById(outcomeId)
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

const deleteOutcome = async (outcomeId) => {
    try {
      const outcomeToDelete = await Outcome.findOne({ _id: outcomeId });
      if (!outcomeToDelete) {
        throw new Error("Outcome not found");
      }
      const deletedIndex = outcomeToDelete.index;

      await Outcome.deleteOne({ _id: outcomeId });
 
      const updatedOutcomes = await Outcome.find({ index: { $gt: deletedIndex } });
      for (const outcome of updatedOutcomes) {
        outcome.index -= 1;
        outcome.title = `Outcome ${outcome.index}`;
        await outcome.save();
      }
  
      return { success: true, message: "Outcome deleted, indexes and titles updated" };
    } catch (error) {
      throw new Error(error.message);
    }
};

const updateOutcome = async ({title, description, gradingCriteria, outcomeId}) => {
    try {
        const formattedGradingCriteria = gradingCriteria.map((item) => ({
            description: item,
          }));
        const updatedOutcome = await Outcome.findByIdAndUpdate(
            outcomeId,
            {
                title,
                description,
                GradingCriteria: formattedGradingCriteria,
            },
            { new: true }
        );
        return updatedOutcome;
    } catch (error) {
        throw new Error(error.message)
    }
}
export default {
    getAllOutcome, 
    createOutcome,
    getOutcome,
    deleteOutcome,
    updateOutcome,
    findById
}