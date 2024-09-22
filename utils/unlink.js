const fs = require("fs");

exports.unlinkFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
};
