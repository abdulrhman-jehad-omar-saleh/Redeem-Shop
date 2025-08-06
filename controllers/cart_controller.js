const products = require("../models/products");
const User = require("../models/users");
const Order = require("../models/orders");
exports.getCart = async (req, res) => {
  try {
    if (!req.session.isAuth) {
      req.flash("error", "You must be logged in to view your cart.");
      return res.redirect("/shop/main");
    }

    const userId = req.session.user._id;

    // Get user with populated cart products
    const user = await User.findById(userId).populate("cart.productId");

    // const cartProducts = user
    //   ? user.cart.map((item) => item.productId).filter(Boolean)
    //   : [];
    const cartProducts = user
      ? user.cart
          .map((item) => ({
            product: item.productId,
            qty: item.qty,
          }))
          .filter((item) => item.product && item.qty)
      : [];

    res.render("shop/cart", {
      title: "Cart",
      isAuth: req.session.isAuth,
      user: req.session.user,
      cart: cartProducts,
      errorMessage: req.flash("error"),
      successMessage: req.flash("success"),
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while loading your cart.");
    res.redirect("/shop/main");
  }
};

exports.getAddToCart = (req, res) => {
  if (!req.session.isAuth) {
    req.flash("error", "You must be logged in to add items to your cart.");
    return res.redirect("/shop/main");
  }
  const productId = req.params.id;
  const user = req.session.user;
  // console.log("user:", user);
  User.findById(user._id)
    .then((foundUser) => {
      if (!foundUser) {
        req.flash("error", "User not found.");
        return res.redirect("/shop/main");
      }
      return products.findById(productId).then((product) => {
        if (!product) {
          req.flash("error", "Product not found.");
          return res.redirect("/shop/main");
        }
        if (!product.code || product.code.length === 0) {
          req.flash("error", "Product is out of stock.");
        } else {
          // Check if product already exists in cart
          if (
            foundUser.cart.some(
              (item) => item.productId.toString() === product._id.toString()
            )
          ) {
            foundUser.cart = foundUser.cart.map((item) => {
              if (item.productId.toString() === product._id.toString()) {
                if (product.code.length < item.qty + 1) {
                  req.flash("error", "Not enough stock available.");
                  return item; // Do not increment if not enough stock
                }
            req.flash("success", "Product added to cart successfully.");
                item.qty += 1; // Increment quantity if product already in cart
              }
              return item;
            });
          } else {
            // Add new product to cart
            foundUser.cart.push({ productId: product._id });
            req.flash("success", "Product added to cart successfully.");
          }
          return foundUser.save().then(() => {
            req.session.user = foundUser; // Update session user
            res.redirect("/shop/main");
          });
        }
      });
    })
    .catch((err) => {
      console.error(err);
      req.flash(
        "error",
        "An error occurred while adding the product to the cart."
      );
      res.redirect("/shop/main");
    });
};
exports.getBuyNow = (req, res) => {
  if (!req.session.isAuth) {
    req.flash("error", "You must be logged in to buy items.");
    return res.redirect("/shop/main");
  }
  const productId = req.params.id;
  const user = req.session.user;
  User.findById(user._id).then((foundUser) => {
    if (!foundUser) {
      req.flash("error", "User not found.");
      return res.redirect("/shop/main");
    }
    return products.findById(productId).then((product) => {
      if (!product) {
        req.flash("error", "Product not found.");
        return res.redirect("/shop/main");
      }
      // Check if product already exists in cart
      if (
        foundUser.cart.some(
          (item) => item.productId.toString() === product._id.toString()
        )
      ) {
        foundUser.cart = foundUser.cart.map((item) => {
          if (item.productId.toString() === product._id.toString()) {
            if (product.code.length < item.qty + 1) {
              req.flash("error", "Not enough stock available.");
              return item; // Do not increment if not enough stock
            }    
            req.flash("success", "one more product added to cart successfully.");
            item.qty += 1; // Increment quantity if product already in cart
          }
          return item;
        });
      } else {
        foundUser.cart.push({ productId: product._id });
        req.flash("success", "Checkout.");
      }
      return foundUser.save().then(() => {
        req.session.user = foundUser; // Update session user
        res.redirect("/shop/cart");
      });
    });
  });
};
exports.postRemoveFromCart = (req, res) => {
  const productId = req.params.id;
  const user = req.session.user;
  // const success = "";
  User.findById(user._id).then((foundUser) => {
    if (!foundUser) {
      req.flash("error", "User not found.");
      return res.redirect("/shop/cart");
    }
    if (
      foundUser.cart.some((item) => {
        if (item.productId.toString() === productId && item.qty === 1) {
          return true; // If the product is not in the cart or its quantity is 1, remove it
        }
      })
    ) {
      foundUser.cart = foundUser.cart.filter(
        (item) => item.productId.toString() !== productId
      );
      req.flash("success", "Product removed from cart successfully.");
    } else {
      foundUser.cart = foundUser.cart.map((item) => {
        if (item.productId.toString() === productId) {
          item.qty -= 1; // Decrement quantity if product exists in cart
        }
        return item;
      });
    }
    return foundUser.save().then(() => {
      req.session.user = foundUser; // Update session user
      res.redirect("/shop/cart");
    });
  });
};

const mongoose = require("mongoose");
exports.postCheckout = async (req, res) => {
  try {
    if (!req.session.isAuth) {
      req.flash("error", "You must be logged in to checkout.");
      return res.redirect("/shop/main");
    }
    String.prototype.isNumber = function () {
      return /^\d+$/.test(this);
    };
    // console.log("req.body:", req.body);
    if(!req.session.user.payment){
      if (
        !req.body.cardnumber.isNumber() ||
        req.body.cardnumber.length < 16 ||
        !req.body.expirydate.includes("/")
      ) {
        req.flash("error", "Invalid Card Number");
        return res.redirect("/shop/cart");
      }
    }

    // proceed with checkout
    const userId = req.session.user._id;

    const foundUser = await User.findById(userId);
    if (!foundUser) {
      req.flash("error", "User not found.");
      return res.redirect("/shop/cart");
    }

    if (foundUser.cart.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/shop/cart");
    }

    // Check stock availability first (before making any changes)
    for (const cartItem of foundUser.cart) {
      const product = await products.findById(cartItem.productId);

      if (!product) {
        req.flash("error", "One or more products not found.");
        return res.redirect("/shop/cart");
      }

      if (!product.code || product.code.length === 0) {
        req.flash("error", `Product "${product.name}" is out of stock.`);
        return res.redirect("/shop/cart");
      }
      if(product.code.length < cartItem.qty){
        req.flash("error", `Not enough stock for product "${product.name}".`);
        return res.redirect("/shop/cart");
      }
    }

    // If all products are available, process the orders
    const orders = [];

    for (const cartItem of foundUser.cart) {
      const product = await products.findById(cartItem.productId);

      // Remove one code from product
      const code = product.code.pop();
      if (product.code.length === 0) {
        product.code = []; // Ensure code is an empty array if no codes left
      }
      await product.save();

      // Create order
      const order = new Order({
        userId: foundUser._id,
        productId: product._id,
        totalPrice: req.body.totalPrice, // Assuming price is the total price for the product
        productPrice: product.price,
        code: code,
      });

      const savedOrder = await order.save();
      orders.push(savedOrder);
    }
    // Save Card Details
    if(req.body.savecard){
      foundUser.payment = {
        card_no: req.body.cardnumber,
        expiry_date: req.body.expirydate,
        cvv: req.body.cvv,
      };
      req.session.user.payment = foundUser.payment; // Update session payment details
    }
    // Clear cart after all orders are successful
    foundUser.cart = [];
    await foundUser.save();

    // Update session
    req.session.user.cart = [];

    req.flash("success", `${orders.length} order(s) placed successfully.`);
    res.redirect("/shop/cart/orders");
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred during checkout.");
    res.redirect("/shop/cart");
  }
};

exports.getOrders = async (req, res) => {
  try {
    if (!req.session.isAuth) {
      req.flash("error", "You must be logged in to view your orders.");
      return res.redirect("/shop/main");
    }

    const userId = req.session.user._id;
    const orders = await Order.find({ userId }).populate("productId");

    res.render("shop/orders", {
      title: "Your Orders",
      isAuth: req.session.isAuth,
      user: req.session.user,
      orders: orders,
      errorMessage: req.flash("error"),
      successMessage: req.flash("success"),
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "An error occurred while loading your orders.");
    res.redirect("/shop/main");
  }
};
