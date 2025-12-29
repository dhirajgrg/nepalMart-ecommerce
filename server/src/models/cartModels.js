const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
