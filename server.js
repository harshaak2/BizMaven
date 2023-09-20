const express = require("express");

const ejs = require("ejs");

const bodyparser = require("body-parser");

const mongoose = require("./mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const {Business, User,Visit, Review, Collection, Stats, Cookie} = require("./models");


const cookieParser = require("cookie-parser");

const userRoutes = require("./userRoutes");
const businessRoutes= require("./businessRoutes")

var app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());
app.use(cookieParser());

app.use(async function setCookie(req, res, next){
  var cookie = req.cookies.cookieValue;
  if(!cookie){
    let mongocookie = new Cookie({auth: false});
    await mongocookie.save()
    var id = mongocookie._id.toString();
    res.locals.cookie = mongocookie;
    res.cookie('cookieValue', id, {maxAge: 604800000})
    console.log("cookie set");
    console.log(id);
  }
  else{
  res.locals.cookie = await Cookie.findById(cookie)
  }
  next();
});

app.set("view engine", "ejs");


app.listen(8085, "localhost", (err) => {
  console.log(err);
});

app.get("/hello", async (req, res)=> {
  const stats=[]
  stats.push(await Business.countDocuments({}),await User.countDocuments({}),await Visit.countDocuments({}), 22)
  res.render("pages/Landing", { stats , cookie: res.locals.cookie});
});
app.get("/about", async(req, res)=>{
  const stats=[]
  stats.push(await Business.countDocuments({}),await User.countDocuments({}),await Visit.countDocuments({}), 22)
  res.render("pages/about", { stats , cookie: res.locals.cookie});
});
app.get("/contact", async(req, res)=>{
  res.render("pages/contact", {cookie: res.locals.cookie});
});
app.use("/user", userRoutes());
app.use("/business", businessRoutes());

app.get("/404", (req, res) => {
  res.render("pages/404", {cookie: res.locals.cookie});
});
app.get("/logout", async (req, res)=>{
 await Cookie.findByIdAndUpdate(res.locals.cookie._id, {
  auth:false,
  userId:null
 }); 
 res.status(200).send({message: "successfull"});
});

app.get("*", (req, res) => {
  res.redirect("/hello");
});

app.get("/admin", function(req, res){
  res.render("pages/admin",
  {
    
  });
})