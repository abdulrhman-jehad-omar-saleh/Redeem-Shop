const moongoose = require("mongoose");
const Schema = moongoose.Schema;
const OrderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  productPrice:{
    type: Number,
    required: true,
  },
  totalPrice:{
    type: Number,
    required: true,
  },
  code:{
    type: String,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = moongoose.model("orders", OrderSchema);
