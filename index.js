const express = require("express");
const app = express();
require("dotenv").config()
const cookie = require("cookie-parser")
const session = require("express-session")
const connectToMongo = require("./connection");
const autRouter = require("./router/auth");
const projectRouter = require("./router/project");
const taskRouter = require("./router/tasks");

const cors = require("cors")


const fileUplader = require("express-fileupload")
const { validateAuthToken } = require("./middleware/auth");
app.use(express.urlencoded({ extended: false }));
// enable for other router;
// not valtion all bracnh ok
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))

app.use(express.json())
app.use(cookie())
app.use(fileUplader())
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  //set true only in production with HTTPS

}))
// app.use("/public", express.static("public"));
app.use("/uploads", express.static("public/uploads"));


connectToMongo(process.env.MONGO_URL);

// auth api's
app.use("/api", autRouter);

// project api's
app.use("/api", validateAuthToken("token"), projectRouter);
app.use("/api", validateAuthToken("token"), taskRouter);
app.listen(process.env.PORT, () =>
  console.log(`App started at port ${process.env.PORT}`)
);
