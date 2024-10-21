
import mongoose from 'mongoose';
import Mentor from "../model/Mentor.js";
import TagMajor from '../model/TagMajor.js';
import Group from '../model/Group.js';

const getAllMentors = async (tagIds, name, page, limit) => {
  try {
    const tagIdArray = Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : [];
    const searchConditions = [];
    if (tagIdArray.length > 0) {
      searchConditions.push({
        'tag.id': { $in: tagIdArray.map(id => new mongoose.Types.ObjectId(id)) }
      });
    }

    if (name) {
      searchConditions.push({
        name: { $regex: name, $options: 'i' }
      });
    }

    const matchCondition = searchConditions.length > 0 ? { $or: searchConditions } : {};
    const totalItems = await Mentor.countDocuments(matchCondition);
    const maxPages = Math.ceil(totalItems / limit);
    const mentors = await Mentor.aggregate([
      {
        $match: matchCondition
      },
      {
        $lookup: {
          from: 'TagMajors',
          localField: 'tag.id',
          foreignField: '_id',
          as: 'tags'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNumber: 1,
          profile: 1,
          assignedClasses: 1,
          profilePicture: 1,
          createdAt: 1,
          updatedAt: 1,
          tags: 1
        }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);
    const isLastPage = page >= maxPages;
    return {
      mentors,
      totalItems,
      maxPages,
      isLastPage,
      pageSize: limit,
      pageIndex: page
    };
  } catch (error) {
    throw new Error(error.message);
  }
};



const getMentor = async () => {
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
const assignMentor = async ({ groupId, mentorId }) => {
  try {

    const group = await Group.findById(groupId);
    if(group.mentor){  
      await Mentor.findByIdAndUpdate(
        group.mentor,
        {
          $pull: { assignedGroup: { id: groupId } }, 
        },
        { new: true }
      );
    }
    await Group.findByIdAndUpdate(
      groupId,
      {
        mentor: mentorId
      }
    );
<<<<<<< HEAD
    const updateMentor = await Mentor.findByIdAndUpdate(
      mentorId,
      {
        $addToSet: { assignedGroup: { id: groupId } }, 
      },
      { new: true }
    );
=======
    console.log(updateMentor);
>>>>>>> a1ed80df6f9897a5ec4065522093039b4639575f

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
