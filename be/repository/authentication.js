import Account from "../model/Account.js";
import User from "../model/RegisteredUser.js";
import Student from "../model/Student.js";

const authenticate = async () => {
  try {
    return { data: "hahaha" };
  } catch (error) {
    throw new Error(error.toString());
  }
};
const addUser = async ({
  email,
  hashedPassword,
  imgLink
}) => {
  try {
    const accountNew = await Account.create({
      email: email,
      password: hashedPassword,
      profilePicture: imgLink
    });
    const student = await findByEmail(email);
    const studentId = student._id;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { account: accountNew._id },
      { new: true }
    );
    return {
      accountNew,
      updatedStudent,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
const getUserByTerm = async ({ termCode }) => {
  try {
    const existingUser = await Student.findOne({ term: termCode }).exec();
    return existingUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getUserByEmail = async ({ name, studentId, generation, email, profession }) => {
  try {
    const user = await Student.findOne({ email }).exec();

    if (!user) {
      throw new Error("User not found: No user matches the provided email.");
    }

    if (user.name !== name) {
      throw new Error("Name is incorrect.");
    }

    if (user.studentId !== studentId) {
      throw new Error("Student ID is incorrect.");
    }

    if (user.gen !== generation) {
      throw new Error("Generation is incorrect.");
    }

    if (user.major !== profession) {
      throw new Error("Major is incorrect.");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};


const findByEmail = async (email) => {
  return await Student.findOne({ email: email }).exec();
};

const findAccount = async (email) => {
  return await Account.findOne({ email: email }).exec();
};

const verifyUser = async (userId) => {
  try {
    const unverifiedUser = await Account.findById(userId).exec();
    if (!unverifiedUser) {
      throw new Error("Not found!!");
    }
    if (unverifiedUser.verify) {
      throw new Error("The user has already been verified!!");
    }
    const result = await Account.findOneAndUpdate(
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
  generateResetToken,
  getUserByTerm,
  findAccount
};
