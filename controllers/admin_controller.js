const User = require("../models/users");
const products = require("../models/products");
exports.getManageProducts = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  // console.log(req.session.user.access);
  if (req.session.user.access !== "server_users") {
    res.render("admin/products", {
      title: "Manage Products",
      errorMessage: req.flash("error"),
      isAuth: req.session.isAuth,
      invalid: false,
      user: req.session.user,
    });
  }
  else{
    res.redirect("/admin/manageUsers");
  }
  // console.log("Inside controller.getlogin");
  // res.send("Login route is working");
};
exports.getAddEditProducts = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  res.render("admin/AddEditProducts", {
    title: "Add Products",
    errorMessage: req.flash("error"),
    isAuth: req.session.isAuth,
    invalid: false,
    user: req.session.user,
  });
  // console.log("Inside controller.getlogin");
  // res.send("Login route is working");
};
exports.getManageUsers = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  if (
    req.session.user.access === "server_owner" ||
    req.session.user.access === "server_users"
  ) {
    User.find({})
      .then((qusers) => {
        return res.render("admin/users", {
          title: "Manage Users",
          errorMessage: req.flash("error"),
          isAuth: req.session.isAuth,
          invalid: false,
          user: req.session.user,
          users: qusers,
        });
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        req.flash("error", "Failed to fetch users");
        return res.redirect("/admin/manageProducts");
      });
  } else {
    return res.redirect("/admin/manageProducts");
    // console.log("Inside controller.getlogin");
    // res.send("Login route is working");
  }
};
