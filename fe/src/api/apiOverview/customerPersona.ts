import axios from "../../utils/axiosUtil";

export const customerPersona = {
  createCustomerPersona: async (
    groupId: any,
    detail: any,
    bio: any,
    needs: any
  ) => {
    return await axios.post(
      `api/group/createCustomerPersona?groupId=${groupId}`,
      {
        detail,
        bio,
        needs,
      }
    );
  },

  updateCustomerPersona: async (
    groupId: any,
    personaId: any,
    detail: any,
    bio: any,
    needs: any
  ) => {
    return await axios.patch(
      `api/group/updateCustomerPersona?groupId=${groupId}&personaId=${personaId}`,
      {
        detail,
        bio,
        needs,
      }
    );
  },

  deleteCustomerPersona: async (groupId: any, personaId: any) => {
    return await axios.delete(
      `api/group/deleteCustomerPersona?groupId=${groupId}&personaId=${personaId}`
    );
  },
};
