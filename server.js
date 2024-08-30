const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

const noteRoutes = require("./routes/notes");

const app = express();

const storageConfigure = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const suffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, suffix + "-" + file.originalname);
  },
});

const filterConfigure = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, undefined);
  }
};

app.use(cors());

app.use(
  multer({ storage: storageConfigure, fileFilter: filterConfigure }).single(
    "cover_img"
  )
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
