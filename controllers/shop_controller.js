const products = require("../models/products");
exports.getShop = (req, res) => {
  products
    .find({})
    .then((qproducts) => {
      res.render("shop/main", {
        title: "Shop",
        isAuth: req.session.isAuth,
        user: req.session.user,
        products: qproducts,
        errorMessage: req.flash("error"),
      });
    })
};
exports.getIndex = (req, res) => {
    res.redirect("/shop/main");
  };
exports.getRedeem = (req, res) => {
  products
    .find({type: "redeem"})
    .then((qproducts) => {
      res.render("shop/main", {
        title: "Redeems",
        isAuth: req.session.isAuth,
        user: req.session.user,
        products: qproducts,
        errorMessage: req.flash("error"),
      });
    })
};
exports.getCoupon = (req, res) => {
  products
    .find({type: "coupon"})
    .then((qproducts) => {
      res.render("shop/main", {
        title: "Coupons",
        isAuth: req.session.isAuth,
        user: req.session.user,
        products: qproducts,
        errorMessage: req.flash("error"),
      });
    })
};
exports.getCart = (req, res) => {
  if (!req.session.isAuth) {
    req.flash("error", "You must be logged in to view your cart.");
    return res.redirect("/shop/main");
  }
  const user = req.session.user;
  res.render("shop/cart", {
    title: "Cart",
    isAuth: req.session.isAuth,
    user: user,
    cart: user.cart,
    errorMessage: req.flash("error"),
    successMessage: req.flash("success"),
  });
}