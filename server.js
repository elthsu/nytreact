var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");

// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");

mongoose.Promise = Promise;

var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("./public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


mongoose.connect("mongodb://localhost/scraper");

// Database configuration with mongoose

mongoose.connection.on("connected", function(){
  console.log("Mongoose connection successful.");
});



app.get("/scrape", function(req, res){
  // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
  request("http://www.theforce.net/", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape
    var dbResult = {};

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $(".news-teaser").each(function(i, element) {

      // Save the text of the element in a "title" variable
      dbResult.title = $(element).find(".news-headline").text();
      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      dbResult.link = $(element).find("a").attr("href");
      dbResult.content = $(element).find(".news-teaser-content").text();

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(dbResult);

      // Now, save that entry to the db
        entry.save(function(err, doc) {
          // Log any errors
          if (err) {
            console.log(err);
          }
          // Or log the doc
          else {
            console.log(doc);
          }
        });
      });
    // Log the results once you've looped through each of the elements found with cheerio
    // console.log(results);
  });
});

// display data to browswe through handlebars
app.get("/results", function(req, res) {
	Article.find({saved:false}, function(err, doc) {
		var hbsObject= {
			articles: doc
		};
    console.log(hbsObject);
		res.render("results", hbsObject);
	});
});

app.get("/saved", function(req, res){
  Article.find({saved:true}, function(err, doc) {
		var hbsObject= {
			articles: doc
		};
		res.render("saved", hbsObject);
	});
});

app.get("/", function(req, res) {
		res.render("index");
});


app.post("/saved/:id", function(req, res){

  Article.findOneAndUpdate({ _id: req.params.id}, { $set: { "saved": true } }, { new: true }, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.send(doc);
    }
  });
});


app.post("/remove/:id", function(req, res){

  console.log(req.params);
  Article.findOneAndUpdate({ _id: req.params.id}, { $set: { "saved": false } }, { new: true }, function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Or send the doc to the browser
    else {
      res.send(doc);
    }
  });
});

// New note creation via POST route
app.post("/submit/:id", function(req, res) {
  // Use our Note model to make a new note from the req.body
  console.log(req.params);
  console.log(req.body);
  var newNote = new Note(req.body);
  // Save the new note to mongoose
  newNote.save(function(error, doc) {
    console.log(doc);
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our user and push the new note id into the User's notes array
      Article.findOneAndUpdate({_id:req.params.id}, { $push: { "note": doc._id } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });
});

// Route to see what user looks like WITH populating
app.get("/seenotes/:id", function(req, res) {
  // Prepare a query to find all users..
  Article.find({_id:req.params.id})
    // ..and on top of that, populate the notes (replace the objectIds in the notes array with bona-fide notes)
    .populate("note")
    // Now, execute the query
    .exec(function(error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.send(doc);
      }
    });
});


// Route to see what user looks like WITH populating
app.get("/seenotes/", function(req, res) {
  // Prepare a query to find all users..
  Article.find({})
    // ..and on top of that, populate the notes (replace the objectIds in the notes array with bona-fide notes)
    .populate("note")
    // Now, execute the query
    .exec(function(error, doc) {
      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.send(doc);
      }
    });
});

// Route to see what user looks like WITH populating
app.get("/notes/:id", function(req, res) {
  // Prepare a query to find all users..
  console.log(req.params.id);
  Article.find({_id : req.params.id}).populate("note").exec(function(error, doc) {

      // Send any errors to the browser
      if (error) {
        res.send(error);
      }
      // Or send the doc to the browser
      else {
        res.send(doc);
      }
    });
});

app.post("/deleteNote/:id", function(req, res){

  Note.findByIdAndRemove(req.params.id, function(err, doc){
    res.send(doc);
  });
});

// Listen on port 3010
app.listen(process.env.PORT || 3010, function() {
  console.log("App running on port 3010!");
});
