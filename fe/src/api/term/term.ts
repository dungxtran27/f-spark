import axios from "../../utils/axiosUtil";

export const term = {
    getAllTermsToFilter: async () => {
        return await axios.get(`/api/term/getAll`);
    },
    getActiveTerm: async () => {
        return await axios.post(`/api/term/active`);
    },
};
// termRouter.post("/active", TermController.getActiveTerm);
