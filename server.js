var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var PORT = 3000;

var db = require("./models");

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/populatedb", {
  useMongoClient: true
});

db.User.create({ name: "Ernest Hemingway" })
  .then(function(dbUser) {
    console.log(dbUser);
  })
  .catch(function(err) {
    console.log(err.message);
  });

// Routes

app.get("/notes", function(req, res) {
  db.Note.find({})
    .then(function(dbNote) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/user", function(req, res) {
  db.User.find({})
    .then(function(dbUser) {
      res.json(dbUser);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/submit", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      
      return db.User.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbUser) {
      res.json(dbUser);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/populateduser", function(req, res) {
  db.User.find({})
    .populate("notes")
    .then(function(dbUser) {
      res.json(dbUser);
    })
    .catch(function(err) {
    
      res.json(err);
    });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});
