const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  // Title, description, provider, type, code, counter, price, oldPrice, image, category, createdAt, updatedAt, endAt
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  code: {
    type: [String],
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
    default: null,
  },
  category: {
    type: [String],
    required: true,
  },
  type:{
    type: String,
    enum: ["redeem", "coupon"],
    default: "redeem",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  endAt: {
    type: Date,
    default: null,
  },
});
module.exports = mongoose.model("products", productSchema);
