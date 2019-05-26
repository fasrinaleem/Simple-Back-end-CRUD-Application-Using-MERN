const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Book = new Schema({
  book_title: {
    type: String
  },
  author_name: {
    type: String
  },
  category_name: {
    type: String
  }
});

module.exports = mongoose.model("Book", Book);
