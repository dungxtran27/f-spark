import Account from "../model/Account.js";
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
import { sendConfirmEmail, sendMail } from "../utils/mailTransport.js";
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
    const emailHtml = `
    <div style="display:flex;justify-content:center;">
    <div>
        <div style="background-color: #ff5e3a;border-radius: 10px 10px 0 0; padding: 5px;">Your account is successfully granted.</div>
        <div style="background-color: #fff; padding: 10px;">
            <h2 style="text-align:center">F-SPARK ACCOUNT</h2>
            <p>Hello Teacher,</p>
            <p>Your password for your account is: <strong>${plainPassword}</strong></p>
            <p>Please use this password to log in and consider changing it to a more secure one.</p>
            
            <button style="border:none;border-radius: 5px;padding:5px 10px;margin-left:13em;background-color: #ff5e3a;color:white; text-align: center;cursor:pointer"><p style="margin:0">Click <a href="http://localhost:3000/STUDENT/login" style="text-decoration-line: none;color:white;">here</a> to login.</p></div>
            </button>

        <div style="background-color: #ccc; padding: 2px;">
            <p style="text-align: center;font-size:10px;margin:0">© FSPARK</p>
        </div>
    </div>
  </div>
    `
    await sendMail(
          email,
          "Fspark setting up you account",
          "Almost there mate, just one more step and we are up and ready",
          emailHtml
        )
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
