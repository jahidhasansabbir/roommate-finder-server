const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ythsg28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("roommatedb");
    const roommateColl = database.collection("roommate");

    app.post("/roommate", async (req, res) => {
      const result = await roommateColl.insertOne(req.body);
      res.send(result);
    });

    app.get("/roommate", async (req, res) => {
      const result = await roommateColl.find().toArray();
      res.send(result);
    });
    
    app.get("/home", async(req, res)=>{
      const query = {availability: "available"}
      const result = await roommateColl.find(query).limit(6).toArray();
      res.send(result);
    })
    
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await roommateColl.findOne(query);
      res.send(result);
    });

    app.patch("/update/:id", async (req, res) => {
      const {
        title,
        location,
        rentAmount,
        roomType,
        lifeStyle,
        availability,
        description,
        contact
      } = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          title,
          location,
          rentAmount,
          roomType,
          lifeStyle,
          availability,
          description,
          contact
        }
      };
      const result = await roommateColl.updateOne(query, update);
      res.send(result)
    });

    app.delete("/delete/:id", async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await roommateColl.deleteOne(query);
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
};
run();

app.get("/", (req, res) => {
  res.send("The roommate finder server is running...");
});

app.listen(port, () => {
  console.log("Running on port", port);
});
