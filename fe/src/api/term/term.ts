import axios from "../../utils/axiosUtil";

export const term = {
    getAllTermsToFilter: async () => {
        return await axios.get(`/api/term/getAll`);
    },
};
