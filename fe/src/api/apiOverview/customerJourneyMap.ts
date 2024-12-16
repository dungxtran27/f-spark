import axios from "../../utils/axiosUtil";

export const customerJourneyMapApi = {
  createColumn: async (groupId: string) => {
    return await axios.post(`api/group/createColumn?groupId=${groupId}`);
  },
  createRow: async (groupId: string) => {
    return await axios.post(`api/group/createRow?groupId=${groupId}`);
  },
  getGroupData: async (groupId: string) => {
    return await axios.get(`api/group?groupId=${groupId}`);
  },
  updateColumnCustomerJourneyMap: async (
    groupId: string,
    colId: string,
    colName: string,
    color: string
  ) => {
    return await axios.patch(`api/group/updateColumn?groupId=${groupId}`, {
      groupId,
      colId,
      name: colName,
      color: color,
    });
  },

  updateRowCustomerJourneyMap: async (
    groupId: string,
    rowId: string,
    rowName: string
  ) => {
    return await axios.patch(`api/group/updateRow?groupId=${groupId}`, {
      groupId,
      rowId,
      name: rowName,
    });
  },

  updateCellContentCustomerJourneyMap: async (
    groupId: string,
    cellId: string,
    content: string
  ) => {
    return await axios.patch(`api/group/updateCellContent?groupId=${groupId}`, {
      groupId,
      cellId,
      content: content,
    });
  },

  deleteRowContentCustomerJourneyMap: async (
    groupId: string,
    rowId: string
  ) => {
    return await axios.delete(
      `api/group/deleteRow?groupId=${groupId}&rowId=${rowId}`,
      {}
    );
  },

  deleteColContentCustomerJourneyMap: async (
    groupId: string,
    colId: string
  ) => {
    return await axios.delete(
      `api/group/deleteCol?groupId=${groupId}&colId=${colId}`,
      {}
    );
  },
};
