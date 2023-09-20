const express = require("express");
userRouter = express.Router();
const mongoose = require("./mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const { User, Cookie, Collection } = require("./models");

var fs = require('fs');
var path = require('path');
var multer = require('multer');
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

userRouter.post('/changeDp', upload.single('image'), async (req, res, next) => {
  var userId = res.locals.cookie.userId;
    var pic =  {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }
      console.log(pic);
  await User.findByIdAndUpdate(userId, {
  pic
  });
  await unlinkAsync(req.file.path)
  res.redirect(`/user/${userId}`);   
});
userRouter.get('/changeDp',async(req, res)=>{
  var userId = res.locals.cookie.userId;
  res.redirect(`/user/${userId}`);
})
userRouter.post("/SignUp", async (req, res) => {
  let userData = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
  };
  if ((await User.countDocuments({ email: userData.email })) > 0) {
    return res
      .status(400)
      .send({ message: "Email already exists", code: true });
  }
  let user = new User(userData);
  await user.save();
  const cookie = await Cookie.findById(res.locals.cookie._id);
  cookie.userId = user._id;
  cookie.auth = true;
  await cookie.save();
  res.status(200).send({ id: user._id });
});
userRouter.post("/SignIn", async (req, res) => {
  let userData = {
    email: req.body.email,
    password: req.body.password,
  };
  const user = await User.findOne({ email: userData.email });
  if (!user) {
    return res
      .status(400)
      .send({ message: "Email does not exist", error: true });
  }
  if (user.password != userData.password) {
    console.log(user.password);
    console.log(userData.password);
    return res.status(400).send({ message: "Incorrect password", error: true });
  }
  const cookie = await Cookie.findById(res.locals.cookie._id);
  cookie.userId = user._id;
  cookie.auth = true;
  cookie.business=false;
  await cookie.save();
  res.status(200).send({ id: user._id });
});
userRouter.get("/auth", (req, res) => {
  res.render("pages/userSignUp", { cookie: res.locals.cookie });
});
userRouter.get("/search", (req, res) => {
  res.render("pages/try1", { cookie: res.locals.cookie });
});


userRouter.get("/collection/:id", async (req, res) => {
  var collection = await Collection.findById(req.params.id).populate({
    path: "businesses",
  });
  res.render("pages/collection", {
    collection,
    cookie: res.locals.cookie,
  });
});

userRouter.get("/addCollection/:collectionName",async(req, res)=>{
  var collection = new Collection({collectionName:req.params.collectionName, userId:res.locals.cookie.userId});
  await collection.save();
  res.status(200).send({message:"Successfull"});
})
userRouter.get("/deleteCollection/:id",async(req, res)=>{
  await Collection.deleteOne({_id:req.params.id});
  res.status(200).send({message:"Successfull"});
})
userRouter.get("/deleteFromCollection/:cid/:bid",async(req, res)=>{
  console.log(req.params.id);
  await Collection.findByIdAndUpdate(req.params.cid,{
    $pull :{
      businesses: ObjectId(req.params.bid)
    }
  });
  res.status(200).send({message:"Successfull"});
})

userRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  const collections = await Collection.find({userId:req.params.id}).populate({
    path: "businesses",
  });
  res.render("pages/profile1", { user,collections, cookie: res.locals.cookie });
});



module.exports = function userRoutes() {
  return userRouter;
};
