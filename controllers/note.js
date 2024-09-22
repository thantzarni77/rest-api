const { validationResult } = require("express-validator");
const Note = require("../models/note");

//unlink file
const { unlinkFile } = require("../utils/unlink");

exports.getNotes = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 6;
  let totalNotes;
  let totalPage;

  Note.find()
    .countDocuments()
    .then((count) => {
      totalNotes = count;
      totalPage = Math.ceil(totalNotes / perPage);
      return Note.find()
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })

    .then((notes) => {
      return res.status(200).json({ notes, totalPage });
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
    author: req.userID,
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
    .populate("author", "username")
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
  Note.findById(id)
    .then((note) => {
      if (note.author.toString() !== req.userID) {
        return res.status(401).json({
          message: "User not authorized",
        });
      }
      if (note.cover_img) {
        unlinkFile(note.cover_img);
      }
      return Note.findByIdAndDelete(id).then(() => {
        return res.status(204).json({
          message: "Note Deleted",
        });
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
      if (note.author.toString() !== req.userID) {
        return res.status(401).json({
          message: "User not authorized",
        });
      }
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
  const cover_img = req.file;
  Note.findById(noteID)
    .then((note) => {
      if (note.author.toString() !== req.userID) {
        return res.status(401).json({
          message: "User not authorized",
        });
      }
      note.title = title;
      note.content = content;
      if (cover_img) {
        if (note.cover_img) {
          unlinkFile(note.cover_img);
        }
        note.cover_img = cover_img.path;
      }
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
