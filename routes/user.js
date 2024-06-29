import express from "express";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';
import {checkUser,registerUser,loginuser,forgotPassword,reSet,generatepassword, genertaesting, finduser, generatenewpassword} from '../helper.js'
import { error } from "console";

const router = express.Router()



//register
    router.post('/', async (req, res) => {
      const { firstname,secondname,Email, password } = req.body
      //validate user
      const isUserExist = await checkUser(Email)
      if (isUserExist) {
          res.status(400).send({ message: "Email already Exist" })
          return
      }
      const Password = await generatepassword(password)
      const Newdata ={firstname,secondname,Email, Password}
      const result = await registerUser(Newdata)
      res.send(result)
  });



//login
router.post('/login', async (req, res) => {
    const { Email, password } = req.body; 
    console.log(Email, password,req.body)
    try {
        const user = await loginuser(Email); 
        console.log(user)
        if (!user) {
            res.status(400).send({ message: "Invalid Credentials" });
            return;
        }
        
        const comparing=await bcrypt.compare(password,user.Password);
        console.log(password, user.Password)
        console.log(comparing)
        
        if (comparing) {
          res.send("Login successful");
        } else {
          res.status(400).send({error});
        }
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});


//enter email to generate random string and sotre in DB and to send to email

router.post("/forgotpassword", async (req, res) =>{
  const { Email } = req.body;  
 
  try{
    const string = crypto.randomBytes(10).toString('hex').slice(0, 10);

    const password= await genertaesting(string);
    const tempdata = {Email,password}
    console.log(tempdata.password)
   const update= await forgotPassword(tempdata);
   console.log(update)
  
     if(update){
      var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.email,
        pass: process.env.password
      }
    });
    
    var mailOptions = {
      from: process.env.email,
      to: `${Email}`,
      subject: 'Sending Email using Node.js',
      text: `Your password reset link: http://localhost:5173/reset 
      and enter this :${string}` 
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
          res.send("Enter the Code Sent to your mail!");}
 
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
});


//to reset password 
router.post("/reset", async (req, res) => {
  try {
    const newdata = req.body;
const findinguser = await finduser(newdata);
console.log(findinguser)
const comparing=await bcrypt.compare(newdata.password,findinguser.Password);
console.log(comparing)
const has = await generatenewpassword(newdata)
const Email = newdata.Email;
const changeddata={Email,has};
console.log(changeddata.Email,changeddata.has)
if(comparing){
    await reSet(changeddata);
  res.send("Password change successful");
}
else{
  res.send("Something went wrong!")
}
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

   const usersRouter = router
   export default usersRouter