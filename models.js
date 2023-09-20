const mongoose = require("mongoose"),
Schema = mongoose.Schema
var businessSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  CIN: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  OwnerName: {
    type: String,
    required: true,
  },
  Address: {
    street: String,
    city: String,
    state: String,
  },
  addressm: String,
  addressb: String,
  views: {
    type:Number,
    default: 0
  },
  phone: String,
  email: String,
  estd: Number,
  zipcode: String,
  desc: String,
  timings: String,
  pic: String,
  types: [String],
  tags: [String],
  events: [String],
  pic: {
    data:Buffer,
    contentType: String,
  }
});

var userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: String,
  pic: {
    data:Buffer,
    contentType: String,
  }
});

var reviewSchema = new mongoose.Schema({
  Rating: Number,
  Review: String,
  user: { type: Schema.Types.ObjectId, ref: "user" },
  business: { type: Schema.Types.ObjectId, ref: "business" },
});

var visitSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  business: { type: Schema.Types.ObjectId, ref: "business" },
});

var collectionSchema = new mongoose.Schema({
  collectionName:String,
  businesses: [{ type: Schema.Types.ObjectId, ref: "business" }],
  userId: String,
});



var cookieSchema = new mongoose.Schema({
    userId: String,
    auth: Boolean,
    business: {
      type: Boolean,
      default: false
    }
});

module.exports = {
  Business: mongoose.model("business", businessSchema),
  User: mongoose.model("user", userSchema),
  Review: mongoose.model("review", reviewSchema),
  Collection: mongoose.model("collection", collectionSchema),
  Visit: mongoose.model("visit",visitSchema),
  Cookie: mongoose.model("cookie", cookieSchema)
};
