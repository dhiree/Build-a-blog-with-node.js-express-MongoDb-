require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookiePaser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

mongoose.connect('mongodb+srv://bhandaridheere:9878249693@cluster0.kbjsfkh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

mongoose.connection.on('error', err => {
    console.log('connection faild');
});

mongoose.connection.on('connected', connectied => {
    console.log('connected with database.......')

});


const app = express();
const PORT = process.env.PORT || 8000;


app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

