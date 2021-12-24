var express = require("express");
var cors = require("cors");

var app = express();
const MongoClient = require("mongodb").MongoClient;
var corsForGet = cors({ origin: "*", method: "GET" });
var corsForGetAll = cors({ origin: "*", method: "GET" });
var corsForPost = cors({ origin: "*", method: "POST" });

const mongoClient = new MongoClient(
  "mongodb+srv://PolkaUser:polka1337@cluster0.ntrtu.mongodb.net/POLKA?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const BooksAccessedParams = [
  "bookID",
  "bookName",
  "bookAutor",
  "bookOwner",
  "bookGenre",
  "bookImage",
  "bookDescription",
  "bookAddress"
];
const UserAccessedParams = [
  "userID",
  "userFirstName",
  "userSurName",
  "userLastName",
  "userLogin",
  "userPassword",
  "userToken",
  "userPhone",
  "userInstitute",
  "userAddress"
];

app.use(express.json());
app.use(cors());

app.get(
  "/books",
  async (e, r) => {
    let books = {};

    await mongoClient.connect();
    const db = mongoClient.db("Polka");
    const collection = db.collection("Books");

    books = await collection.find().toArray();

    r.status(200).send(books);
  },
  corsForGet
);

app.get(
  "/books/:id",
  async (req, res) => {
    let bookID = Number(req.params.id);
    console.log(bookID);
    await mongoClient.connect();
    const db = mongoClient.db("Polka");
    const collection = db.collection("Books");

    let bookData = await collection.findOne({ bookID: bookID });
    console.log(bookData);
    res.status(200).send(bookData);
  },
  corsForGet
);

app.get(
  "/users/:id",
  async (req, res) => {
    let userID = Number(req.params.id);
    console.log(userID);
    await mongoClient.connect();
    const db = mongoClient.db("Polka");
    const collection = db.collection("Users");

    let userData = await collection.findOne({ id: userID });
    console.log(userData);
    res.status(200).send(userData);
  },
  corsForGet
);
app.get(
  "/users",
  async (req, res) => {
    let userID = req.params;
    console.log(userID);
    await mongoClient.connect();
    const db = mongoClient.db("Polka");
    const collection = db.collection("Users");

    let userData = await collection.find().toArray();
    console.log(userData);
    res.status(200).send("users");
  },
  corsForGet
);
app.post("/books", bookLogic, corsForPost);

app.post("/users", userLogic, corsForPost);

//create a server object:

const PORT = 6000;
app.listen(PORT || 5000, () => console.log("work"));

function NullCheck(param) {
  if (param === "" || param === " ") return true;
  else return false;
}

async function bookLogic(req, res) {
  console.log("init");
  let bookSendedObject = req.body;
  let bookProperties = Object.keys(req.body);

  for (let property of bookProperties) {
    console.log(property);
    if (
      NullCheck(bookProperties[property]) ||
      !BooksAccessedParams.includes(property)
    ) {
      delete bookSendedObject[property];
    }
  }

  if (Object.keys(bookSendedObject).length < BooksAccessedParams.length - 1) {
    res.status(200).send("books send error");
    return;
  }
  await mongoClient.connect();
  const db = mongoClient.db("Polka");
  const collection = db.collection("Books");

  console.log(collection);

  collection.insertOne(bookSendedObject);
  res.status(200).send("books");
}

async function userLogic(req, res) {
  console.log(req.body);
  console.log("init");
  let userSendedObject = req.body;
  let userProperties = Object.keys(req.body);

  for (let property of userProperties) {
    console.log(property);
    if (
      NullCheck(userProperties[property]) ||
      !UserAccessedParams.includes(property)
    ) {
      delete userSendedObject[property];
    }
  }
  if (Object.keys(userSendedObject).length < UserAccessedParams.length - 1) {
    res.status(200).send("user send error");
    return;
  }
  await mongoClient.connect();
  const db = mongoClient.db("Polka");
  const collection = db.collection("Users");

  console.log(collection);

  collection.insertOne(userSendedObject);
  res.status(200).send("Users");
}
