const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://xcash.netlify.app",
    ],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

const authenticateJWT = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  // console.log(token, "token pai");
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zwicj3r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = `mongodb://localhost:27017` ;

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
    const paymentHistory = client.db("xcash").collection("payments");
    // users collection
    app.post("/register", async (req, res) => {
      const info = req.body;
      const hashedPassword = await bcrypt.hash(info.pin, 10);
      const maininfo = { ...info, hashedPassword: hashedPassword };
      const result = await allUserData.insertOne(maininfo);
      res.send(result);
    });

    app.post("/login", async (req, res) => {
      const { emailornumber, pin } = req.body;
      const query = {
        $or: [{ email: emailornumber }, { number: emailornumber }],
      };
      const user = await allUserData.findOne(query);
      // console.log(emailornumber, pin, user);
      // console.log(user, "paichi");
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isPasswordValid = await bcrypt.compare(pin, user.hashedPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ emailornumber }, process.env.SECRET_KEY, {
        expiresIn: "365day",
      });
      res.json({ token, userType: user?.userType, email: user?.email });
    });

    app.get("/protected", authenticateJWT, (req, res) => {
      res.json({ message: "This is a protected route" });
    });

    app.get("/allusers", authenticateJWT, async (req, res) => {
      const result = await allUserData.find().toArray();
      res.send(result);
    });

    app.get("/user/:email", authenticateJWT, async (req, res) => {
      const email = req.params.email;
      // console.log(email ,'d')
      const result = await allUserData.findOne({ email });
      res.send(result);
    });

    // update user a role by admin
    app.patch("/alluser/:email", authenticateJWT, async (req, res) => {
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

    // sendmoney by user and add money another and history
    app.patch("/transfer/:number", async (req, res) => {
      const userType = "user";
      const number = req.params.number;
      const query = { number, userType };
      let amount = parseFloat(req.body.amount);
      let fee = 0;
      const userNumber = req.body.userNumber;
      try {
        // Retrieve the current user data
        const user = await allUserData.findOne(query);

        if (!user) {
          console.log("No user");
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

        if (amount > 100) fee = 5;
        const postpayments = await paymentHistory.insertOne({
          To: number,
          amount: amount,
          fee: fee,
          From: userNumber,
          Type: "sendmoney",
        });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    });
    // sendmoney and minus balance from user
    app.patch("/minus/:number", async (req, res) => {
      const number = req.params.number;
      const query = { number };
      let amount = parseFloat(req.body.amount);
      try {
        // Retrieve the current user data
        const user = await allUserData.findOne(query);

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }
        if (amount > 100) amount = amount + 5;
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

    // Cashout by user and add money to agent and history
    app.patch("/cashouttransfer/:number", async (req, res) => {
      const userType = "agent";
      const number = req.params.number;
      const query = { number, userType };
      const amount =
        parseFloat(req.body.amount) + parseFloat(req.body.amount * (1.5 / 100));
      const userNumber = req.body.userNumber;
      // console.log(parseFloat(req.body.amount * (1.5 / 100)));
      try {
        // Retrieve the current user data
        const user = await allUserData.findOne(query);

        if (!user) {
          console.log("No user");
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
        const postpayments = await paymentHistory.insertOne({
          To: number,
          amount: parseFloat(req.body.amount),
          fee: parseFloat(req.body.amount * (1.5 / 100)),
          From: userNumber,
          Type: "Cashout",
        });
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
    });
    // cashout and minus from senders balance
    app.patch("/cashoutminus/:number", async (req, res) => {
      const number = req.params.number;
      const query = { number };
      const amount =
        parseFloat(req.body.amount) + parseFloat(req.body.amount * (1.5 / 100));
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

    //CashIn request to agent
    app.patch("/cashin/:email", async (req, res) => {
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
    // get all paymentHistory for admin
    app.get("/paymentHistory", authenticateJWT, async (req, res) => {
      const result = await paymentHistory.find().toArray();
      res.send(result);
    });
    // get paymentHistory by specifiq user
    app.get("/paymentHistory/:number", authenticateJWT, async (req, res) => {
      const number = req.params.number;
      const query = {
        $or: [{ From: number }, { To: number }],
      };
      const result = await paymentHistory.find(query).toArray();
      res.send(result);
    });

    // get cashIn requested users 
    app.get("/requestedusers/:number", async (req, res) => {
      const number = req.params.number;
      const query = { requestnumber: number };
      const result = await allUserData.find(query).toArray();
      res.send(result);
    })
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
