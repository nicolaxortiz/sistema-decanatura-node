import bcrypt from "bcrypt";
import crypto from "crypto";

export const encryptPassword = async (password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const compare = async (password, hash) => {
  try {
    const result = await bcrypt.compare(password, hash);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generatePassword = async () => {
  return crypto
    .randomBytes(Math.ceil(8 / 2))
    .toString("hex")
    .slice(0, 8);
};
