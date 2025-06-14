const express=require('express');
const app=express();
app.set('view engine','ejs');
app.set('views','views');
const mongoose= require('mongoose');
const session = require('express-session');
mongoose.connect("mongodb://localhost:27017/redeem-app").then((result)=>{
    console.log("Connect Successfully!");
   });
   
const bodyParser=require('body-parser');
const path = require("path");
const connectflash=require("connect-flash");  
app.use(bodyParser.urlencoded({extended:false}));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret:'202411481',
    resave:false,
    saveUninitialized:false,
}));
app.use(connectflash());
app.get('/test', (req, res) => {
  res.send("Test route working");
});
const shopRouter = require('./routes/shop_router');
const authRouter = require('./routes/auth_router');
const AdminProductRouter = require('./routes/admin/products_router');
const AdminUserRouter = require('./routes/admin/users_router');
const cartRouter = require('./routes/cart_router');
// console.log("Routes are working!");
app.use(shopRouter);
app.use(AdminProductRouter);
app.use(AdminUserRouter);
app.use(authRouter);
app.use(cartRouter);
// const adminRoutes=require('./routes/admin');
// app.use('/admin',adminRoutes);
// const errorController=require('./controllers/errors');
// app.use(errorController.get404);
app.listen(8000,()=>{
    console.log("Server is running on port 8000 successfully!");
});