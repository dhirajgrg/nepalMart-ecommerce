const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    amounts: {
      itemsTotal: Number,
      deliveryFee: Number,

      vendorCommission: Number,
      vendorEarning: Number,

      riderEarning: Number,
      platformEarning: Number,
    },
    payoutStatus: {
      vendor: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
      },
      rider: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
