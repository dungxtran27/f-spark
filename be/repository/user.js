import mongoose from "mongoose";
import User from "../model/RegisteredUser.js";

const findById = async (id) => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default {
  findById
};
