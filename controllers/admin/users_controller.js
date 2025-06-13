const User = require("../../models/users");
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
    req.flash("error", "You do not have permission");
    return res.redirect("/shop/main");
  }
};

// USER MANAGEMENT POST
exports.postEditUser = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  // console.log("Editing user:", req.body);
  console.log(
    "Access:",
    req.body.access.includes("provider") + "{" + req.body.access + "}"
  );
  const userId = req.body.userId;
  const isAdmin = req.body.access === "user" ? false : true;
  const access = req.body.access.includes("provider")
    ? req.body.provider
    : req.body.access;
  console.log("Result :" + isAdmin, access);
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
