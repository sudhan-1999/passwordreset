import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
import usersRouter from './routes/user.js'
import cors from 'cors';


 const app = express();
const PORT = 5000;
 app.use(cors());
//Inbuilt middleware =>  say data is in json => converting body to json
app.use(express.json())

const MONGO = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO);
  await client.connect();
  console.log("Mongodb is connected");
  return client;
}


export const client = await createConnection();

//to gegister enter the following details
/*
  {
    "firstname":"",
    "secondname":"",
    "Email":"",
    "password":""
}
*/

app.use("/", usersRouter);
  
//enter email and password to login as mmentiones here
/*{
   "Email":"",
    "password":""
} */
app.use("/login", usersRouter);


//enter email to generate random string and sotre in DB and to send to email
app.use("/forgotpassword", usersRouter);


//to reset password
app.use("/reset", usersRouter);



app.listen(PORT, () => console.log(`Server started on the PORT, ${PORT}`));

export default {client,app}; 