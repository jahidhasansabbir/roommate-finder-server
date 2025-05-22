const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// simpleDB:
const uri =
  "mongodb+srv://simpleDB:qCuLROAePBVx8cHy@cluster0.ythsg28.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
