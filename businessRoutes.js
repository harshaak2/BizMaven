const express = require("express");
businessRouter = express.Router();
const mongoose = require("./mongoose");
const { Business, Review, Cookie, Visit, Collection } = require("./models");
const ObjectId = require("mongoose").Types.ObjectId;


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

businessRouter.post('/changeDp', upload.single('image'), async (req, res, next) => {
  var userId = res.locals.cookie.userId;
    var pic =  {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }
  await Business.findByIdAndUpdate(userId, {
  pic
  });
  await unlinkAsync(req.file.path)
  res.redirect(`/business/edit/${userId}`);   
});
userRouter.get('/changeDp',async(req, res)=>{
  var userId = res.locals.cookie.userId;
  res.redirect(`/user/business/edit/${userId}`);
});


businessRouter.post("/review", async (req, res) => {
  try {
    var reviewData = req.body;
    reviewData.user = (await Cookie.findById(res.locals.cookie._id)).userId;
    var exists = await Review.exists({
      user: reviewData.user,
      business: reviewData.business,
    });
    if (exists) {
      await Review.deleteOne({
        user: reviewData.user,
        business: reviewData.business,
      });
    }
    var review = new Review(reviewData);
    await review.save();
    res.status(200).send({ message: "ok" });
  } catch (err) {
    console.log(err);
  }
});
businessRouter.post("/SignUp", async (req, res) => {
  let businessData = {
    Name: req.body.Name,
    CIN: req.body.CIN,
    addressb: req.body.address || "not provided",
    addressm: req.body.addressb || "not provided",
    password: req.body.password,
    OwnerName: req.body.username,
    pic: req.body.pic || "/store.png",
    estd: req.body.estd,
    desc: req.body.desc || "",
    timings: "",
    phone: req.body.phone,
    email: req.body.email,
    zipcode: req.body.zipcode,
  };
  if (
    await Business.exists({ email: businessData.email, CIN: businessData.CIN })
  ) {
    return res.status(400).send({ message: "Business already registered" });
  }
  var business = new Business(businessData);
  await business.save();
  res.status(200).send({ id: business._id });
});

businessRouter.post("/SignIn", async (req, res) => {
  let userData = {
    email: req.body.email,
    password: req.body.password,
  };
  const user = await Business.findOne({ email: userData.email });
  if (!user) {
    return res.status(400).send({ message: "Does not exist", error: true });
  }
  if (user.password != userData.password) {
    console.log(user.password);
    console.log(userData.password);
    return res.status(400).send({ message: "Incorrect password", error: true });
  }
  const cookie = await Cookie.findById(res.locals.cookie._id);
  cookie.userId = user._id;
  cookie.auth = true;
  cookie.business = true;
  await cookie.save();
  res.status(200).send({ id: user._id });
});
businessRouter.get("/Page/:id", async (req, res) => {
  if(req.params.id!=res.locals.cookie.userId) return res.status(400).send({message: "Not Authenticated"})
  var businessdb = await Business.findById(req.params.id);
  const business = {
    ownername: businessdb.OwnerName,
    pic: businessdb.pic,
    password: businessdb.password,
    Name: businessdb.Name,
    CIN: businessdb.CIN,
    phone: businessdb.phone,
    email: businessdb.email,
    zipcode: businessdb.zipcode,
    addressb: businessdb.addressb,
    timings: businessdb.timings,
    desc: businessdb.desc,
  };
  res.render("pages/businessPage", { business });
});
businessRouter.get("/edit/:id", async (req, res)=>{
  if(req.params.id!=res.locals.cookie.userId) return res.status(400).send({message: "Not Authenticated"})
  var businessdb = await Business.findById(req.params.id);
  const business = {
    ownername: businessdb.OwnerName,
    pic: businessdb.pic,
    password: businessdb.password,
    Name: businessdb.Name,
    CIN: businessdb.CIN,
    phone: businessdb.phone,
    email: businessdb.email,
    zipcode: businessdb.zipcode,
    addressb: businessdb.addressb,
    addressm: businessdb.addressm,
    timings: businessdb.timings,
    desc: businessdb.desc,
    events: businessdb.events,
  };
  console.log(business);
  res.render("pages/edit", { business });
});
businessRouter.get("/chart/:id", async (req, res) => {
  var businessdb = await Business.findById(req.params.id);
  const business = { ...businessdb };
  console.log();
  const monthlyRatings = await Review.aggregate([
    {
      $match: {
        business: ObjectId(req.params.id),
      },
    },
    {
      $project: {
        year: { $year: "$_id" },
        month: { $month: "$_id" },
        Rating: "$Rating",
      },
    },
    {
      $match: {
        $or: [
          {
            year: {
              $eq: new Date().getFullYear() - 1,
            },
            month: {
              $gte: new Date().getMonth(),
            },
          },
          {
            year: {
              $eq: new Date().getFullYear(),
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: "$month",
        y: {
          $avg: "$Rating",
        },
      },
    },
  ]).exec();
  console.log(monthlyRatings);
  const ratingsEach = await Review.aggregate([
    {
      $match: {
        business: ObjectId(req.params.id),
      },
    },
    {
      $group: {
        _id: "$Rating",
        y: {
          $sum: 1,
        },
      },
    },
  ]);
  console.log(ratingsEach);
  const monthlyVisits = await Visit.aggregate([
    {
      $match: {
        business: ObjectId(req.params.id),
      },
    },
    {
      $project: {
        year: { $year: "$_id" },
        month: { $month: "$_id" },
        Rating: "$Rating",
      },
    },
    {
      $match: {
        $or: [
          {
            year: {
              $eq: new Date().getFullYear() - 1,
            },
            month: {
              $gte: new Date().getMonth(),
            },
          },
          {
            year: {
              $eq: new Date().getFullYear(),
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: "$month",
        y: { $sum: 1 },
      },
    },
  ]).exec();
  console.log(monthlyVisits);
  const avgR = await Review.aggregate([
    {
      $match: {
        business: ObjectId(req.params.id),
      },
    },
    {
      $group: {
        _id: null,
        y: { $avg: "$Rating" },
      },
    },
  ]);
  const totalVisits = await Visit.aggregate([
    {
      $match: {
        business: ObjectId(req.params.id),
      },
    },
    {
      $group: {
        _id: null,
        y: { $sum: 1 },
      },
    },
  ]);
  res
    .status(200)
    .send({ monthlyRatings, monthlyVisits, ratingsEach, avgR, totalVisits });
});

businessRouter.get("/auth", (req, res) => {
  res.render("pages/VendorSignUp", { cookie: res.locals.cookie });
});

businessRouter.get("/addToCollection/:bid/:cid", async (req, res) => {
  try{var collection = await Collection.findByIdAndUpdate(req.params.cid, {
    $push:{businesses: ObjectId(req.params.bid)}
  });}catch(err){
    console.log(err);
  }
  res.status(200).send({message:"Successfull"})
});

businessRouter.post("/changeDetails/:id",async(req, res)=>{
  console.log(req);
  await Business.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).send({message:"Successfull"})
});

businessRouter.post("/getBusinesses",async (req, res)=>{
  console.log("at filter");
  const filter = {
    Name: {$regex:new RegExp(`^${req.query.s}`), $options:"i"},
    ...req.body.body
  };
  if(req.body.events.length>0)
  filter.events={
    $all : req.body.events
  };
  var businesses  = await Business.find(filter, "_id Name desc pic addressm");
  businesses = await Promise.all(businesses.map(async business=>{
    var ratings = await Review.aggregate([
      { $match: { business: ObjectId(business._id) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$Rating",
          },
          count: { $sum: 1 },
        },
      },
    ]).exec();
    console.log(ratings)
    var business2 = JSON.parse(JSON.stringify(business));
    if (ratings.length==0) {
      (business2.nor = 0), (business2.Rating = 0);
    } else {
      business2.nor = ratings[0].count;
      business2.Rating = ratings[0].total / ratings[0].count;
    }
    return business2;
  }));
  businesses = businesses.filter((business)=>business.Rating>req.query.r);
  res.status(200).send({businesses});
});

businessRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("here")
  const business = await Business.findById(id);
  let businessData = {
    Name: business.Name,
    pic: business.pic,
    estd: business.estd,
    desc: business.desc,
    timings: business.timings,
    addressm: business.addressm,
    addressb: business.addressb,
    phone: business.phone,
    email: business.email,
    zipcode: business.zipcode,
  };
  const user = (await Cookie.findById(res.locals.cookie._id)).userId;
  const visit = new Visit({ user, business: id });
  await visit.save();
  try {
    var ratings = await Review.aggregate([
      { $match: { business: ObjectId(id) } },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$Rating",
          },
          count: { $sum: 1 },
        },
      },
    ]).exec();
    console.log(ratings)
    if (ratings.length==0) {
      (businessData.nor = 0), (businessData.Rating = 0);
    } else {
      businessData.nor = ratings[0].count;
      businessData.Rating = ratings[0].total / ratings[0].count;
    }
    businessData.reviews = await Review.find({})
      .sort({ date: -1 })
      .limit(3)
      .populate({
        path: "business",
        match: { _id: id },
      })
      .populate("user")
      .exec();
    var userCollections = await Collection.find({
      userId: res.locals.cookie.userId,
    });

    res.render("pages/business", {
      businessData,
      userCollections,
      cookie: res.locals.cookie,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = function businessRoutes() {
  return businessRouter;
};
