const products = require("../models/products");
const User = require("../models/users");
exports.getShop = (req, res) => {
  products.find({}).then((qproducts) => {
    res.render("shop/main", {
      title: "Shop",
      isAuth: req.session.isAuth,
      user: req.session.user,
      products: qproducts,
      errorMessage: req.flash("error"),
    });
  });
};
exports.getIndex = (req, res) => {
  res.redirect("/shop/main");
};
exports.getRedeem = (req, res) => {
  products.find({ type: "redeem" }).then((qproducts) => {
    res.render("shop/main", {
      title: "Redeems",
      isAuth: req.session.isAuth,
      user: req.session.user,
      products: qproducts,
      errorMessage: req.flash("error"),
    });
  });
};
exports.getCoupon = (req, res) => {
  products.find({ type: "coupon" }).then((qproducts) => {
    res.render("shop/main", {
      title: "Coupons",
      isAuth: req.session.isAuth,
      user: req.session.user,
      products: qproducts,
      errorMessage: req.flash("error"),
    });
  });
};
