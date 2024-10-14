import User from "../model/RegisteredUser.js";

const authenticate = async () => {
  try {
    return { data: "hahaha" };
  } catch (error) {
    throw new Error(error.toString());
  }
};
const addUser = async ({
  firstName,
  lastName,
  email,
  hashedPassword,
}) => {
  try {
    const existingUser = await User.findOne({ email: email }).exec();
    if (existingUser) {
      throw new Error("The email has already been registered !!");
    }
    const result = await User.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
    });
    return result._doc;
  } catch (error) {
    throw new Error(error.message);
  }
};
const verifyUser = async (userId) => {
  try {
    const unverifiedUser = await User.findById(userId).exec();
    if (!unverifiedUser) {
      throw new Error("Not found!!");
    }
    if (unverifiedUser.verify) {
      throw new Error("The user has already been verified!!");
    }
    const result = await User.findOneAndUpdate(
      { _id: userId },
      { $set: { verify: true } },
      { new: true }
    );
    if (!result) {
      throw new Error("Something went wrong:(");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserById = async (userId) => {
  try {
    const existingUser = await User.findById(userId).exec();
    if (!existingUser) {
      throw new Error("Not found!!");
    }
    return existingUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserByEmail = async (email) => {
  try {
    const existingUser = await User.findOne({ email: email }).exec();
    return existingUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findByEmail = async (email) => {
  return await User.findOne({ email: email }).exec();
};

const generateResetToken = async (userId, role) => {
  return jwt.sign({ userId, role }, process.env.RESET_TOKEN_SECRET, { expiresIn: '1h' });
};
export default {
  authenticate,
  addUser,
  verifyUser,
  getUserById,
  getUserByEmail,
  findByEmail,
  generateResetToken
};
