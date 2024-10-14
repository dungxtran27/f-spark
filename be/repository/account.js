import Account from "../model/Account.js";
const findAccountByEmail = async (email) => {
  try {
    const existingUser = await Account.findOne({email: email});
    console.log(existingUser);
    
    return existingUser;
  } catch (error) {
    throw new Error(error.message);
  }
};
export default {
  findAccountByEmail,
};
