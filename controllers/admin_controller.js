const User = require("../models/users");
const products = require("../models/products");
const { register } = require("module");
exports.getManageProducts = (req, res) => {
  if (!req.session.user.isAdmin) {
    return res.redirect("/shop/main");
  }
  // console.log(req.session.user.access);
  if (req.session.user.access !== "server_users") {
    const query = req.session.user.access.includes("server")
      ? {}
      : { provider: req.session.user.access };
    products
      .find(query)
      .then((qproducts) => {
        res.render("admin/products", {
          title: "Manage Products",
          errorMessage: req.flash("error"),
          isAuth: req.session.isAuth,
          invalid: false,
          user: req.session.user,
          products: qproducts,
        });
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        req.flash("error", "Failed to fetch products");
        res.redirect("/admin/manageProducts");
      });
  } else {
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
    title: "Manage Add Products",
    errorMessage: req.flash("error"),
    successMessage: req.flash("success"),
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
          successMessage: req.flash("success"),
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
exports.postEditUser = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  // console.log("Editing user:", req.body);
  console.log("Access:", req.body.access.includes("provider")+"{"+req.body.access+"}");
  const userId = req.body.userId;
  const isAdmin = req.body.access === "user" ? false : true;
  const access = req.body.access.includes("provider") ? req.body.provider : req.body.access;
  console.log("Result :"+isAdmin, access);
  User.findById(userId)
    .then((quser) => {
      if (!quser) {
        req.flash("error", "User not found");
        return res.redirect("/admin/manageUsers");
      }
      // console.log("Updating user:", quser);
      quser.isAdmin = isAdmin;
      quser.access = access;
      // console.log("Updated user:", quser);
      return quser.save();
    })
    .catch((err) => {
      console.error("Error updating user:", err);
      req.flash("error", "Failed to update user");
      return res.redirect("/admin/manageUsers");
    })
    .then(() => {
      req.flash("success", "User updated successfully");
      return res.redirect("/admin/manageUsers");
    });
};
exports.postDeleteUser = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  const userId = req.body.userId;
  User.findByIdAndDelete(userId)
    .then(() => {
      req.flash("success", "User deleted successfully");
      return res.redirect("/admin/manageUsers");
    })
    .catch((err) => {
      console.error("Error deleting user:", err);
      req.flash("error", "Failed to delete user");
      return res.redirect("/admin/manageUsers");
    });
};
