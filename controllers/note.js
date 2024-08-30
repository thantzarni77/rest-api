const { validationResult } = require("express-validator");
const Note = require("../models/note");

exports.getNotes = (req, res, next) => {
  Note.find()
    .sort({ createdAt: -1 })
    .then((notes) => {
      return res.status(200).json(notes);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        message: "Something went wrong",
      });
    });
};

exports.createNote = (req, res, next) => {
  const { title, content } = req.body;
  const cover_img = req.file;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation Failed",
      errorMessage: errors.array(),
    });
  }

  Note.create({
    title,
    content,
    cover_img: cover_img ? cover_img.path : undefined,
  })
    .then(() => {
      return res.status(201).json({
        message: "Note Created",
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
      });
      console.log(err);
    });
};

exports.getNote = (req, res) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
      });
      console.log(err);
    });
};

exports.deleteNote = (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => {
      return res.status(204).json({
        message: "Note Deleted",
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
      });
      console.log(err);
    });
};

exports.getOldNote = (req, res) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      return res.status(200).json(note);
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
      });
      console.log(err);
    });
};

exports.updateNote = (req, res) => {
  const { noteID, title, content } = req.body;
  Note.findById(noteID)
    .then((note) => {
      note.title = title;
      note.content = content;
      return note.save();
    })
    .then(() => {
      return res.status(200).json({
        message: "Update Success",
      });
    })
    .catch((err) => {
      res.status(400).json({
        message: "Something went wrong",
      });
      console.log(err);
    });
};
