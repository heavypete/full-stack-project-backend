import express from "express";
//import mongodb, { MongoClient } from "mongodb";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3022;
const mongoConnectionString = process.env.MONGODB_URI;
//const mongoConnectionString = "mongodb://localhost:27017/api001";
//const client = new MongoClient(mongoConnectionString);
mongoose.connect(mongoConnectionString);

app.use(express.json());
app.use(cors());

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
});

const UserModel = mongoose.model("user", userSchema, "users100");

// const execMongo = async (done) => {
//   await client.connect();
//   const db = client.db("api001");
//   done(db);
// };

app.get("/", async (req, res) => {
  // execMongo(async (db) => {
  //   const users = await db
  //     .collection("users100")
  //     .find()
  //     .project({
  //       name: 1,
  //       username: 1,
  //       email: 1,
  //     })
  //     .toArray();
  //   res.json(users);
  // });
  //* Refactoring for Mongoose -  all the commented out code was for mongoDB
  const users = await UserModel.find({}).select("name username email");
  res.json(users);
});

app.delete("/deleteuser/:id", async (req, res) => {
  const id = req.params.id;
  // execMongo(async (db) => {
  //   const deleteResult = await db
  //     .collection("users100")
  //     .deleteOne({ _id: new mongodb.ObjectId(id) });
  //   res.json({
  //     result: deleteResult,
  //   });
  // });
  const deleteResult = await UserModel.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  res.json({
    result: deleteResult,
  });
});

app.post("/insertuser", (req, res) => {
  const user = req.body.user;
  // execMongo(async (db) => {
  //   const insertResult = await db.collection("users100").insertOne(user);
  //   res.json({
  //     result: insertResult,
  //   });
  // });
  const user1 = new UserModel(user);
  user1.save((err) => {
    if (err) {
      res.status(500).send({ err });
    } else {
      res.json({
        userAdded: user1,
      });
    }
  });
});

app.patch("/edituseremail/:id", async (req, res) => {
  const id = req.params.id;
  const email = req.body.email;
  console.log(email);
  // execMongo(async (db) => {
  //   const updateResult = await db
  //     .collection("users100")
  //     .updateOne({ _id: new mongodb.ObjectId(id) }, { $set: { email } });
  //   res.json({
  //     result: updateResult,
  //   });
  // });
  const updateResult = await UserModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
    { $set: { email } },
    { new: true }
  );
  res.json({
    result: updateResult,
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
