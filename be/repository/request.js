import Request from "../model/Request.js";

const getAllRequest = async ({ groupId }) => {
    try {
        const requests = await Request.find({ group: groupId }).populate({
            path: 'group',
            select: 'teamMembers leader',
        }).populate({
            path: 'createBy',
            select: '_id name studentId major',
            populate: {
                path: 'account',
                select: 'profilePicture',
            },
        })
        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
}

const createRequest = async ({ groupId, studentId, actionType }) => {
    try {
        const existingRequest = await Request.findOne({
            createBy: studentId,
            group: groupId,
            actionType,
        });

        if (existingRequest) {
            throw new Error("Request already exists for this student and group.");
        }
        const newRequest = await Request.create({
            typeRequest: "Student",
            createBy: studentId,
            actionType,
            group: groupId,
        });
        return newRequest._doc;
    } catch (error) {
        throw new Error(error.message);
    }
};

const voteOutGroup = async ({ requestId, groupId, studentId, voteType }) => {
    try {
        const request = await Request.findOne({ group: groupId });

        if (!request) {
            throw new Error("Request not found");
        }

        const updateField = voteType === "yes" ? "upVoteYes" : "upVoteNo";
        const oppositeField = voteType === "yes" ? "upVoteNo" : "upVoteYes";


        const data = await Request.updateOne(
            { _id: requestId },
            {
                $addToSet: { [updateField]: studentId },
                $pull: { [oppositeField]: studentId }
            }
        );

        const requests = await Request.find({ group: groupId }).populate({
            path: 'group',
            select: 'teamMembers leader',
        }).populate({
            path: 'createBy',
            select: '_id name studentId major',
            populate: {
                path: 'account',
                select: 'profilePicture',
            },
        })

        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getAllRequest,
    voteOutGroup,
    createRequest
}