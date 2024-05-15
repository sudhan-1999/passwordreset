import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';


const app = express();
const PORT = 5000;

//Inbuilt middleware =>  say data is in json => converting body to json
app.use(express.json())

const MONGO = process.env.MONGO_URL;

async function createConnection() {
  const client = new MongoClient(MONGO);
  await client.connect();
  console.log("Mongodb is connected");
  return client;
}


const client = await createConnection();

//to gegister enter the following details
/*
  {
    "firstname":"",
    "secondname":"",
    "Email":"",
    "password":""
}
*/

app.post("/", async (req, res) => {
    try {
      const newdata = req.body;
      console.log(newdata);
     const room = await client.db("passwordreset").collection("register").insertOne(newdata);
      res.send(room); 
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
//enter email and password to login as mmentiones here
/*{
   "Email":"",
    "password":""
} */
app.get("/login", async (req, res) =>{
    const newdata = req.body;
    try{
    const room = await client.db("passwordreset").collection("register").findOne({
        Email: newdata.Email,
        password: newdata.password
      });    
      res.send(room);
      if(room){
        console.log("user is valid")
      }
      else {console.log("user not valid")}
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
      }
  
});


//enter email
app.post("/forgotpassword", async (req, res) =>{
  const newdata = req.body;
  try{
    const room = await client.db("passwordreset").collection("register").findOne({
        Email: newdata.Email,
      }); 
      if(room){
        //to generate random string to reset password 
const length = 10; 
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let result = '';
const charactersLength = characters.length;
for (let i = 0; i < length; i++) {
  result += characters.charAt(Math.floor(Math.random() * charactersLength));
}
await console.log(result);

 await client.db("passwordreset").collection("register").updateOne( {Email: newdata.Email }, { $set: { password:result  } } );

 var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});

var mailOptions = {
  from: process.env.email,
  to: `${room.Email}`,
  subject: 'Sending Email using Node.js',
  text: `Your password reset link: https://example.com/resetpassword 
  and enter this :${result}` // Adjust this link as needed
};

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
      }
      res.send(room);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
});

app.post("/reset", async (req, res) => {
  try {
    const newdata = req.body;
    console.log(newdata);
    await client.db("passwordreset").collection("register").findOneAndUpdate( {password: newdata.password }, { $set: { password:newdata.Newpassword  } } );
    res.send("password changed sucessfully"); 
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.listen(PORT, () => console.log(`Server started on the PORT, ${PORT}`));
