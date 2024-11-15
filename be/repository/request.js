import Request from "../model/Request.js";
import Group from "../model/Group.js";
import Student from "../model/Student.js";

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
            actionType: "leave",
            status: "pending",
        });

        if (existingRequest) {
            throw new Error("Request already exists for this student and group.");
        }

        if (actionType === "leave") {
            const group = await Group.findOne({ _id: groupId, teamMembers: studentId });

            if (group) {
                await Request.create({
                    typeRequest: "Student",
                    createBy: studentId,
                    actionType: "leave",
                    group: groupId,
                    status: "approved",
                    totalMembers: group.teamMembers.length,
                });
                await Group.updateOne(
                    { _id: groupId },
                    { $pull: { teamMembers: studentId } }
                );
                await Student.updateOne(
                    { _id: studentId },
                    { group: null }
                );
                return group;
            } else {
                throw new Error("Student is not part of the specified group.");
            }
        }

    } catch (error) {
        throw new Error(error.message);
    }
};


const voteOutGroup = async ({ requestId, groupId, studentId, voteType }) => {
    try {
        const request = await Request.findOne({ _id: requestId }).populate({
            path: 'group',
            select: 'teamMembers',
        });

        if (!request) {
            throw new Error("Request not found");
        }

        const updateField = voteType === "yes" ? "upVoteYes" : "upVoteNo";
        const oppositeField = voteType === "yes" ? "upVoteNo" : "upVoteYes";

        await Request.updateOne(
            { _id: requestId },
            {
                $addToSet: { [updateField]: studentId },
                $pull: { [oppositeField]: studentId }
            }
        );

        const updatedRequest = await Request.findOne({ _id: requestId }).populate({
            path: 'group',
            select: 'teamMembers',
        });

        let totalMembers = updatedRequest.group.teamMembers.length;
        const totalYesVotes = updatedRequest.upVoteYes.length;
        const totalVotes = updatedRequest.upVoteYes.length + updatedRequest.upVoteNo.length;

        if (totalVotes === totalMembers) {
            if (request.actionType === "join") {
                if (totalYesVotes === totalMembers) {
                    await Group.updateOne(
                        { _id: groupId },
                        { $addToSet: { teamMembers: request.createBy } }
                    );
                    await Student.updateOne(
                        { _id: request.createBy },
                        { group: groupId }
                    );
                    await Request.updateOne(
                        { _id: requestId },
                        { status: "approved", totalMembers: totalMembers }
                    );
                } else {
                    await Request.updateOne(
                        { _id: requestId },
                        { status: "declined", totalMembers: totalMembers }
                    );
                }
            } else if (request.actionType === "leave") {
                if (totalYesVotes === totalMembers) {
                    await Group.updateOne(
                        { _id: groupId },
                        { $pull: { teamMembers: request.createBy } }
                    );
                    await Student.updateOne(
                        { _id: request.createBy },
                        { group: null }
                    );
                    await Request.updateOne(
                        { _id: requestId },
                        { status: "approved", totalMembers: totalMembers }
                    );
                } else {
                    await Request.updateOne(
                        { _id: requestId },
                        { status: "declined", totalMembers: totalMembers }
                    );
                }
            }
        }

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
        });

        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
};


const joinGroup = async ({ groupId, studentId }) => {
    try {
        const existingRequest = await Request.findOne({
            createBy: studentId,
            actionType: "join",
            status: "pending",
        });

        if (existingRequest) {
            throw new Error("Request join group is already exists");
        }

        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error("Group not found.");
        }

        const newRequest = await Request.create({
            typeRequest: "Student",
            createBy: studentId,
            actionType: "join",
            group: groupId,
            totalMembers: group.teamMembers.length,
        });

        return newRequest._doc;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getRequestJoinByStudentId = async ({ studentId }) => {
    try {
        const requests = await Request.find({
            createBy: studentId,
            status: "pending"
        })
        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
}

const deleteRequestJoinByStudentId = async ({ groupId, studentId }) => {
    try {
        const pendingRequest = await Request.findOne({
            group: groupId,
            createBy: studentId,
            status: "pending",
        });

        if (!pendingRequest) {
            throw new Error("No pending request found for this student and group.");
        }

        const result = await Request.deleteOne({ _id: pendingRequest._id });
        return result;
    } catch (error) {
        throw new Error(error.message);
    }
}

export default {
    getAllRequest,
    voteOutGroup,
    createRequest,
    joinGroup,
    getRequestJoinByStudentId,
    deleteRequestJoinByStudentId
}