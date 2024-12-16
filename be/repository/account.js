import Account from "../model/Account.js";
import bcrypt from 'bcrypt'
const findAccountByEmail = async (email) => {
  try {
    const existingUser = await Account.findOne({ email: email });
    return existingUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
const findAccountById = async (accountId) => {
  try {
    const existingAccount = await Account.findById(accountId);
    return existingAccount;
  } catch (error) {
    throw new Error(error.message);
  }
};
const generateRandomPassword = (length = 5) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
const createAccount = async ({email, profilePicture}) => {
  try {
    const plainPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(plainPassword);
    const result = await Account.create({
      email: email,
      profilePicture: profilePicture,
      password: hashedPassword
    })
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}
export default {
  findAccountByEmail,
  findAccountById,
  createAccount
};
