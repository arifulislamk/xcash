const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwicj3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const allUserData = client.db("xcash").collection("allUser");
    // users collection
    app.post("/adduser", async (req, res) => {
      const info = req.body;
      const result = await allUserData.insertOne(info);
      res.send(result);
    });

    app.get("/allusers", async (req, res) => {
      const result = await allUserData.find().toArray();
      res.send(result);
    });

    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      // console.log(email ,'d')
      const result = await allUserData.findOne({ email });
      res.send(result);
    });

    // update user a role by admin
    app.patch("/alluser/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = req.body;
      const updateDoc = {
        $set: {
          ...user,
        },
      };
      const result = await allUserData.updateOne(query, updateDoc);
      res.send(result);
    });

    // sendmoney by user
    app.patch("/transfer/:number", async (req, res) => {
      const number = req.params.number;
      const query = { number };
      const amount = parseFloat(req.body.amount);
      try {
        // Retrieve the current user data
        const user = await allUserData.findOne(query);

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        // Calculate the new balance
        const newBalance = user.balance + amount;
        // Update the user's balance
        const updateDoc = {
          $set: {
            balance: newBalance,
          },
        };
        const result = await allUserData.updateOne(query, updateDoc);

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    });
    app.patch("/minus/:number", async (req, res) => {
      const number = req.params.number;
      const query = { number };
      const amount = parseFloat(req.body.amount);
      try {
        // Retrieve the current user data
        const user = await allUserData.findOne(query);

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        // Calculate the new balance
        const newBalance = user.balance - amount;
        // Update the user's balance
        const updateDoc = {
          $set: {
            balance: newBalance,
          },
        };
        const result = await allUserData.updateOne(query, updateDoc);

        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`Xcash server is comming`);
});
app.listen(port, () => {
  console.log(`xcans server is runnig port ${port}`);
});
