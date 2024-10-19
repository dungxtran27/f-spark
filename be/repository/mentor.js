
import mongoose from 'mongoose';
import Mentor from "../model/Mentor.js";
import TagMajor from '../model/TagMajor.js';
import Group from '../model/Group.js';

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


const getMentor = async() => {
    try { 
      const result = await Mentor.aggregate([
        { $match: { isActive: true } }, 
        {
          $lookup: {
            from: 'TagMajors',   
            localField: 'tag.id',      
            foreignField: '_id',        
            as: 'tagMajors'           
          }
        },
        { $unwind: '$tagMajors' },
        {
          $group: {
            _id: '$tagMajors._id', 
            tagName: { $first: '$tagMajors.name' }, 
            mentors: {
              $push: {
                _id: '$_id',
                name: '$name',
                email: '$email',
                phoneNumber: '$phoneNumber',
                profile: '$profile',
                assignedClasses: '$assignedClasses',
                profilePicture: '$profilePicture',
                isActive: '$isActive'
              }
            }
          }
        }
      ]);
          return result;
    } catch (error) {
        throw new Error(error.message);
    }
}
const assignMentor = async({groupId,mentorId}) => {
  try {
    const updateMentor = await Group.findByIdAndUpdate(
      groupId,
      {
        mentor: mentorId
      }
    );
    console.log(updateMentor);
    
    return updateMentor;
  } catch (error) {
    throw new Error(error.message);
  }
}
export default {
    getMentor,
    assignMentor,
    getAllMentors
};
