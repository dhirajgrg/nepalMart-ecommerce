const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "please provide customer id"],
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },

        price: {
          type: Number,
          required: true,
        },

        totalItemPrice: {
          type: Number,
          required: true,
        },

       },
    ],

    cartTotal: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "purchased", "abandoned"],
      default: "active",
    },
  },
  { timestamps: true }
);

// auto calculate
cartSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.totalItemPrice = item.quantity * item.price;
  });

  this.cartTotal = this.items.reduce(
    (sum, item) => sum + item.totalItemPrice,
    0
  );

  next();
});

module.exports = mongoose.model("Cart", cartSchema);

