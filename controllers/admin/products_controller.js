const products = require("../../models/products");
exports.getManageProducts = (req, res) => {
  if (!req.session.isAuth) {
    req.flash("error", "You do not have permission");
    return res.redirect("/shop/main");
  }
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
          successMessage: req.flash("success"),
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
};
exports.getAddProducts = (req, res) => {
  if (!req.session.isAuth) {
    req.flash("error", "You do not have permission");
    return res.redirect("/shop/main");
  }
  if (!req.session.user.isAdmin || req.session.user.access === "server_users") {
    req.flash("error", "You do not have permission");
    return res.redirect("/shop/main");
  }
  res.render("admin/addProducts", {
    title: "Manage Add Products",
    errorMessage: req.flash("error"),
    successMessage: req.flash("success"),
    isAuth: req.session.isAuth,
    edit: false,
    user: req.session.user,
  });
};
exports.getEditProducts = (req, res) => {
  if (!req.session.isAuth) {
    req.flash("error", "You do not have permission");
    return res.redirect("/shop/main");
  }
  const productId = req.params.productId;
  products
    .findById(productId)
    .then((product) => {
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/admin/manageProducts");
      }
      res.render("admin/editProducts", {
        title: "Manage Edit Products",
        errorMessage: req.flash("error"),
        successMessage: req.flash("success"),
        isAuth: req.session.isAuth,
        edit: true,
        user: req.session.user,
        product: product,
      });
    })
    .catch((err) => {
      console.error("Error fetching product:", err);
      req.flash("error", "Failed to fetch product");
      return res.redirect("/admin/manageProducts");
    });
};

// PRODUCT MANAGEMENT pOST
exports.postAddProducts = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  const {
    title,
    price,
    desc,
    provider,
    codes,
    category,
    endAt,
    startAt,
    redeemRadio,
  } = req.body;
  let code=codes.split(";").map((code) => code.trim());
    const newProduct = new products({
    title,
    price,
    desc,
    provider,
    code,
    category,
    endAt,
    startAt,
    redeemRadio,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    });
    newProduct
    .save()
    .then((product) =>
        {
            req.flash("success", "Product added successfully");
            return res.redirect("/admin/manageProducts");
        }
    )
    .catch((err) => {
      console.error("Error adding product:", err);
      req.flash("error", "Failed to add product");
      return res.redirect("/admin/manageProducts");
    });
};
exports.postEditProducts = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  }
  const productId = req.body.productId;
  products
    .findById(productId)
    .then((product) => {
      if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/admin/manageProducts");
      }
      product.title = req.body.title;
      product.price = req.body.price;
      product.desc = req.body.desc;
      product.provider = req.body.provider;
      product.codes = req.body.codes;
      product.category = req.body.category;
      product.endAt = req.body.endAt;
      product.code = req.body.codes.split(";").map((code) => code.trim());
      product.startAt = req.body.startAt;
      product.type = req.body.redeemRadio;
      product.updatedAt = Date.now();
      return product.save()
      .then(() => {
      req.flash("success", "Product updated successfully");
      return res.redirect("/admin/manageProducts");
    })
    })
    .catch((err) => {
      console.error("Error updating product:", err);
      req.flash("error", "Failed to update product");
      return res.redirect("/admin/manageProducts");
    });
};

exports.postDeleteProducts = (req, res) => {
  if (!req.session.isAuth) {
    return res.redirect("/shop/main");
  } 
  const productId = req.body.productId;
  products
    .findByIdAndDelete(productId)
    .then(() => {
      req.flash("success", "Product deleted successfully");
      return res.redirect("/admin/manageProducts");
    }
    )
    .catch((err) =>
      {
        console.error("Error deleting product:", err);
        req.flash("error", "Failed to delete product");
        return res.redirect("/admin/manageProducts");
      } 
    );
} ;//end postDeleteProducts
