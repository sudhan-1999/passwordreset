import bcrypt from "bcryptjs";
import { client } from "./index.js";
export async function checkUser(Email) {
  return await client
    .db("passwordreset")
    .collection("register")
    .findOne({ Email: Email });
}
export async function registerUser(Newdata) {
  return await client
    .db("passwordreset")
    .collection("register")
    .insertOne(Newdata);
}
export async function loginuser(Email) {
  try {
    return await client
      .db("passwordreset")
      .collection("register")
      .findOne({ Email: Email });
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Database query failed");
  }
}
export async function forgotPassword(tempdata) {
  try {
    return await client
      .db("passwordreset")
      .collection("register")
      .findOneAndUpdate({ Email: tempdata.Email }, { $set: { Password: tempdata.password } });
  } catch (err) {
    console.log(err);
  }
}
export async function reSet(changeddata) {
  return await client
    .db("passwordreset")
    .collection("register")
    .findOneAndUpdate(
      { Email: changeddata.Email},
      { $set: { Password: changeddata.has } }
    );
}

export async function finduser(newdata){
    try{
    return await client.db("passwordreset").collection("register").findOne({Email: newdata.Email})
}catch(err){console.log(err);}
}

export async function generatepassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  return hashedpassword;
}
export async function generatenewpassword(newdata) {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(newdata.newpassword, salt);
    return hashedpassword;
  }

export async function genertaesting(string) {
  const salt = await bcrypt.genSalt(10);
  const hashedstring = await bcrypt.hash(string, salt);
  return hashedstring;
}
