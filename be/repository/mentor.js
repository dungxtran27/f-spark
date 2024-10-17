import mongoose from 'mongoose';
import Mentor from "../model/Mentor.js";
import TagMentor from "../model/TagMenter.js";
import Group from '../model/Group.js';
const getMentor = async() => {
    try { 
        const result = await Mentor.aggregate([
            { $unwind: '$tag' },
            { $match: { isActive: true } },
            {
              $group: {
                _id: '$tag.id',
                tagName: { $first: '$tag.name' },  
                mentors: {
                  $push: {
                    _id: '$_id',
                    name: '$name',
                    email: '$email',
                    phoneNumber: '$phoneNumber',
                    profile: '$profile',
                    assignedClasses: '$assignedClasses',
                    profilePicture: '$profilePicture',
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
    assignMentor
};
