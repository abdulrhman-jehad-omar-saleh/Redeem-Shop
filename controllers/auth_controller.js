const User = require("../models/users");
console.log("auth_controller.js loaded");
exports.getlogin = (req, res) => {
  if (req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  res.render("auth/login", {
    title: "Login",
    errorMessage: req.flash("error"),
    isAuth: req.session.isAuth,
    invalid: false,
    form:"login",
    user: req.session.user,
  });  
  // console.log("Inside controller.getlogin");
  // res.send("Login route is working");
  
};
exports.getlogout = (req, res) => {
    req.session.isAuth = false;
    req.session.user = null;
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/shop/main");
    }
    res.redirect("/shop/main");
  });
  };

exports.postLogin = (req, res, next) => {
  // console.log(req.body);
  User.find({ username: req.body.username, password: req.body.password }).then((user) => {
      if (user.length != 0) {
        req.session.isAuth = true;
        req.session.user = user[0];
        // console.log(user[0]);
        if (user[0].access !== "user") {
          return res.redirect("/admin/manageProducts");
        }
        return res.redirect("/");
      } else
        return res.render("auth/login", {
          title: "Login",
          isAuth: req.session.isAuth,
          invalid: true,
          form: "login",
          errorMessage: "Invalid username or password",
        });
    });
  }
exports.postSignup = (req, res, next) => {
  const { name, username, password } = req.body;
  User.find({ username: username }).then((existingUser) => {
    if (existingUser.length > 0) {
      return res.render("auth/login", {
        title: "Login",
        errorMessage: "Username already exists",
        isAuth: req.session.isAuth,
        form: "signup",
        invalid: true,
      });
    }
    const user = new User({
      name: name,
      username: username,
      password: password,
    });
    user.save().then(() => {
      invalid: false;
      res.redirect("/login");
    });
  });
};