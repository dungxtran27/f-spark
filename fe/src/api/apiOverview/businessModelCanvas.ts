import axios from "../../utils/axiosUtil";

export const businessModelCanvas = {
  getBusinessModelCanvas: async (groupId: string) => {
    return await axios.get(`api/group/${groupId}`);
  },

  updatwBusinessModelCanvas: async (
    groupId: string,
    color: string,
    content: string,
    name: string
  ) => {
    return await axios.patch(`api/group/updateCanvas?groupId=${groupId}`, {
      color,
      content,
      name,
      groupId,
    });
  },
};
