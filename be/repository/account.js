import Account from "../model/Account.js";
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
export default {
  findAccountByEmail,
  findAccountById
};
