const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: {
    type: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        qty:{
          type: Number,
          default: 1
        },
        default: [],
      },
    ],
    default: [],
  },
  payment: {
    type:{
      card_no:{
        type:String
      },
      expiry_date:{
        type:String
      },
      cvv:{
        type:String
      }
    }
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  access: {
    type: String,
    default: "user",
  },
});
module.exports = mongoose.model("users", UserSchema);
