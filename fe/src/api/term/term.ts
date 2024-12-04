import axios from "../../utils/axiosUtil";

export const term = {
    getAllTermsToFilter: async () => {
        return await axios.get(`/api/term/getAll`);
    },
    getActiveTerm: async () => {
        return await axios.post(`/api/term/active`);
    },
    getTimelineOfTerm: async (termId: string | undefined) => {
        return await axios.get(`/api/term/getTimelineOfTerm/${termId}`);
    },
    createTimelineOfTerm: async (requestBody: any) => {
        return await axios.post(`/api/term/createTimelineOfTerm`, requestBody);
    },
    deleteTimelineOfTerm: async (requestBody: any) => {
        return await axios.post(`/api/term/deleteTimelineOfTerm`, requestBody);
    },
    updateTimelineOfTerm: async (requestBody: any) => {
        return await axios.post(`/api/term/updateTimelineOfTerm`, requestBody);
    },
};
// termRouter.post("/active", TermController.getActiveTerm);
