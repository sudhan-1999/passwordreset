import express from "express";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

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
/*
  {
    firstname: "jayasudhan",
    secondname: "A",
    Email: "jsudhan53@gmail.com",
    password: "jsudhan",
  }
*/

const client = await createConnection();

/*app.post("/", async (req, res) => {
  const newdata = req.body;
  console.log(newdata);
  //const room = await client.db("passwordreset").collection("register").insertOne(newdata);
  //res.send(room)
  res.send(newdata);
});*/
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


app.listen(PORT, () => console.log(`Server started on the PORT, ${PORT}`));
