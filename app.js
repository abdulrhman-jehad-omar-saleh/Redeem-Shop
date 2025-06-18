const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
const mongoose = require("mongoose");
const session = require("express-session");
mongoose.connect("mongodb://localhost:27017/redeem-app").then((result) => {
  console.log("Connect Successfully!");
});

const bodyParser = require("body-parser");
const path = require("path");
const products = require("./models/products");
const connectflash = require("connect-flash");
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "202411481",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectflash());
app.get("/test", (req, res) => {
  res.send("Test route working");
});
const shopRouter = require("./routes/shop_router");
const authRouter = require("./routes/auth_router");
const AdminProductRouter = require("./routes/admin/products_router");
const AdminUserRouter = require("./routes/admin/users_router");
const cartRouter = require("./routes/cart_router");
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
app.listen(8000, () => {
  console.log("Server is running on port 8000 successfully!");
  products
    .find({})
    // find all products to clean old products 
    .then((qproducts) => {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      qproducts.filter((product) => {
        if ( // check if product have no end date and Not have code and is 90 days old
          product.endAt === null &&
          product.code.length > 0 &&
          product.startAt.toDateString() === ninetyDaysAgo.toDateString()
        ) {
          products
            .deleteOne({ _id: product._id })
            .then(() => {
              console.log(`Deleted product with ID: ${product._id}`);
            })
            .catch((err) => {
              console.error(
                `Error deleting product with ID ${product._id}:`,
                err
              );
            });
        } else { // if product is not 90 days old or have code or have end date
          if (product.endAt.toDateString() < ninetyDaysAgo.toDateString()) { // if product have end date and is older than 90 days
            products
              .deleteOne({ _id: product._id })
              .then(() => {
                console.log(`Deleted product with ID: ${product._id}`);
              })
              .catch((err) => {
                console.error(
                  `Error deleting product with ID ${product._id}:`,
                  err
                );
              });
          }
        }
      });
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
    });
});
