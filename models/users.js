const mongoose = require('mongoose');
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
 password:{
 type: String,
 required: true,
 },
 isAdmin:{
    type: Boolean,
    default: false,
 },
 orderHistory: {
   type: [{
       productId: {
          type: Schema.Types.ObjectId,
          ref: 'products',
          required: true
       },
       baid: {
          type: Number,
          required: true,
       },
       orderDate: {
          type: Date,
          default: Date.now
       }
   }],
   default: [],
 },
 createdAt: {
   type: Date,
   default: Date.now,
 },
 access:{
   type: String,
   default: 'user',
}
 });
module.exports= mongoose.model('users', UserSchema);