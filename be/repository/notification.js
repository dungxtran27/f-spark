import Notification from "../model/Notification.js";

const createNotification = async ({ data }) => {
  try {
    const result = await Notification.create({
      action: data?.action,
      type: data?.type,
      sender: data?.sender,
      receivers: data?.receivers,
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  createNotification,
};
