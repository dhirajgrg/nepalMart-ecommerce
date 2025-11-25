const Cart = require("../models/cartsModels");
const Product = require("../models/productsModels");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// create cart---------------------------------
exports.createCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // 1. Find product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found with this ID", 404));
  }

  // 2. Find cart for this user
  let cart = await Cart.findOne({ customer: req.user._id });

  // 3. Create new cart if no cart exists
  if (!cart) {
    cart = await Cart.create({
      customer: req.user._id,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
          totalItemPrice: product.price * quantity,
        },
      ],
      status: "active", // Ensure cart status is set to "active"
    });

    return res.status(201).json({
      status: "success",
      message: "Cart created and item added",
      cart,
    });
  }

  // 4. If cart exists → check item inside cart
  const existingItem = cart.items.find((item) =>
    item.product.equals(productId)
  );

  if (existingItem) {
    // update quantity
    existingItem.quantity += quantity;
    existingItem.totalItemPrice = existingItem.quantity * existingItem.price;
  } else {
    // push new item to cart
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
      totalItemPrice: product.price * quantity,
    });
  }

  // 5. Save cart (pre-save hook calculates cartTotal automatically)
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Item added to cart",
    cart,
  });
});

// update cart---------------------------------
exports.updateCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  // 1. Find the cart by customer ID (use findOne, not findById)
  const cart = await Cart.findOne({ customer: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  // 2. Find the item in the cart
  const item = cart.items.find((item) => item.product.equals(productId));
  if (!item) return next(new AppError("Item not found in cart", 404));

  // 3. Update item quantity and totalItemPrice
  item.quantity = quantity;
  item.totalItemPrice = item.quantity * item.price;

  // 4. Save the cart
  await cart.save();

  // 5. Send the updated cart as a response
  res.status(200).json({
    status: "success",
    message: "Cart updated successfully",
    cart,
  });
});

// delete cart---------------------------------
exports.deleteCart = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  // 1. Find the cart for the logged-in user
  const cart = await Cart.findOne({ customer: req.user._id });
  if (!cart) return next(new AppError("Cart not found", 404));

  // 2. Find the item in the cart to remove
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    return next(new AppError("Item not found in cart", 404)); // Item doesn't exist in the cart
  }

  // 3. Remove the item from the cart
  cart.items.splice(itemIndex, 1); // Remove the item at the found index

  // 4. Save the updated cart
  await cart.save();

  // 5. Send the response with the updated cart
  res.status(200).json({
    status: "success",
    message: "Item deleted successfully",
    cart,
  });
});
