const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const noteRoutes = require("./routes/notes");

app.use(cors());

app.use(bodyParser.json());

app.use(noteRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(8000);
    console.log("Connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });
