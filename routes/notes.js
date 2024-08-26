const express = require("express");
const router = express.Router();
const noteController = require("../controllers/note");
const { body } = require("express-validator");

//get /notes
router.get("/notes", noteController.getNotes);

//post /crate
router.post(
  "/create",
  [
    body("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title is too short")
      .isLength({ max: 30 })
      .withMessage("Title cannot be longer than 30 words"),
    body("content")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Content is too short"),
  ],
  noteController.createNote
);

//get /notes/:id
router.get("/notes/:id", noteController.getNote);

//delete /delete:id
router.delete("/delete/:id", noteController.deleteNote);

module.exports = router;
