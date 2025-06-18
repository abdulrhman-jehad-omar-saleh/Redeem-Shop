const products = require("../models/products");
const User = require("../models/users");
exports.getShop = (req, res) => {
  products.find({}).then((qproducts) => {
    const now = new Date();
    qproducts = qproducts.filter((product) => 
      product.endAt > now && product.startAt <= now && product.code.length > 0
    );

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
    const now = new Date();
    qproducts = qproducts.filter((product) => 
      product.endAt > now && product.startAt <= now && product.code.length > 0
    );
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
    const now = new Date();
    qproducts = qproducts.filter((product) => 
      product.endAt > now && product.startAt <= now && product.code.length > 0
    );
    res.render("shop/main", {
      title: "Coupons",
      isAuth: req.session.isAuth,
      user: req.session.user,
      products: qproducts,
      errorMessage: req.flash("error"),
    });
  });
};
