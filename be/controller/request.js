import { RequestRepository, GroupRepository } from "../repository/index.js"

const getAllRequest = async (req, res) => {
    try {
        const data = await RequestRepository.getAllRequest({ groupId: req.groupId });
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const createRequest = async (req, res) => {
    try {
        const { actionType } = req.body;
        const studentId = req.decodedToken?.role?.id;
        const groupId = req.groupId.toString();
        const data = await RequestRepository.createRequest({ groupId, studentId, actionType });
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const voteOutGroup = async (req, res) => {
    try {
        const { voteType, requestId } = req.body;
        const studentId = req.decodedToken?.role?.id;
        const groupId = req.groupId.toString();
        const data = await RequestRepository.voteOutGroup({ requestId, groupId, studentId, voteType });
        return res.status(201).json({ data: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllGroup = async (req, res) => {
    try {
        const data = await GroupRepository.findAllGroups();
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const joinGroup = async (req, res) => {
    try {
        const studentId = req.decodedToken?.role?.id;
        const { groupId } = req.body;
        const data = await RequestRepository.joinGroup({ groupId, studentId });
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getRequestJoinByStudentId = async (req, res) => {
    try {
        const studentId = req.decodedToken?.role?.id;
        const data = await RequestRepository.getRequestJoinByStudentId({ studentId });
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteRequestJoinByStudentId = async (req, res) => {
    try {
        const studentId = req.decodedToken?.role?.id;
        const { groupId } = req.params;
        const data = await RequestRepository.deleteRequestJoinByStudentId({ groupId, studentId });
        return res.status(200).json({ data: data });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default {
    getAllRequest,
    voteOutGroup,
    createRequest,
    getAllGroup,
    joinGroup,
    getRequestJoinByStudentId,
    deleteRequestJoinByStudentId
}