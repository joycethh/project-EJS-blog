const express = require("express");

const bodyParser = require("body-parser");
const ejs = require("ejs");
const req = require("express/lib/request");
const _ = require("lodash");
const mongoose = require("mongoose");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/blogDB");
}

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

//Using template engines with Express
app.set("view engine", "ejs");

//Node.js body parsing middleware with Express
app.use(bodyParser.urlencoded({ extended: true }));

//Serving static files in Express
app.use(express.static(__dirname + "/public"));

// Home Page
app.get("/", (req, res) => {
  Post.find({}, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(docs);
      res.render("home", {
        homeContent: homeStartingContent,
        posts: docs,
      });
    }
  });
});
//About Page
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

//Contact Page
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

//Moongose Connection & Schema & Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema);

//compose page
app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const mTitle = req.body.newTitle;
  const mContent = req.body.newPost;

  const mPost = new Post({
    title: mTitle,
    content: mContent,
  });
  mPost.save((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
});

//Route Parm
app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }, (err, docs) => {
    if (err) {
      console.log(err);
    } else {
      console.log(requestedPostId + docs);
      res.render("./post", {
        title: docs.title,
        content: docs.content,
      });
    }
  });
});

app.listen(process.env.PORT || 5000, function () {
  console.log("Server started on port 5000");
});
