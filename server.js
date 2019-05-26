const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bookRoutes = express.Router();
const PORT = 4000;

let Book = require("./bookSchema");

//Connecting to database
mongoose
  .connect("mongodb://localhost/books", { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB database connection established successfully");
  })
  .catch(err => {
    console.log(err.message);
  });

//Adding the midlewares
app.use(cors());
app.use(bodyParser.json());

//Attaching the endpoints
//Get all the book details
bookRoutes.route("/").get(function(req, res) {
  Book.find(function(err, books) {
    if (err) {
      console.log(err);
    } else {
      res.json(books);
    }
  });
});

//Get the single book by the id
bookRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Book.findById(id, function(err, book) {
    res.json(book);
  });
});

//Adding new book to the collection
bookRoutes.route("/add").post(function(req, res) {
  let book = new Book(req.body);
  book
    .save()
    .then(book => {
      res.status(200).json({ book: "Book added successfully" });
    })
    .catch(err => {
      res.status(400).send("Adding new book failed");
    });
});

//Update the existing book
bookRoutes.route("/update/:id").post(function(req, res) {
  Book.findById(req.params.id, function(err, book) {
    if (!book) res.status(404).send("Data is not found");
    else book.book_title = req.body.book_title;
    book.author_name = req.body.author_name;
    book.category_name = req.body.category_name;

    book
      .save()
      .then(book => {
        res.json("Book updated");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

//Delete the book
bookRoutes.delete("/delete/:id", (req, res) => {
  Book.findByIdAndRemove({ _id: req.params.id }, (err, book) => {
    if (err) {
      res.json(err);
    } else {
      res.status(200).send("Book deleted successfully");
    }
  });
});

//Midleware
app.use("/books", bookRoutes);

//Starting the server on given port number
app.listen(PORT, function() {
  console.log("Server is running on Port : " + PORT);
});
