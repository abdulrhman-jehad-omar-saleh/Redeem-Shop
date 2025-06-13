exports.getShop = (req, res) => {
  res.render("shop/main", {
    title: "Shop",isAuth:req.session.isAuth,
    user: req.session.user,
    errorMessage: req.flash("error"),
  });
};
exports.getIndex = (req, res) => {
    res.redirect("/shop/main");
  };