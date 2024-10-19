import Mentor from "../model/Mentor.js";


const getAllMentors = async () => {
  try {
    const mentors = await Mentor.find()
      .populate({
        path: "assignedClasses.id",
        select: "classCode backgroundImage", 
      })
    return mentors;
  } catch (error) {
    throw new Error("Error fetching mentors: " + error.message);
  }
};

export default {
  getAllMentors,
};