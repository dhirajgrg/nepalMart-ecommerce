const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
      default: null,
    },

    items: [
      {
        product: mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    subtotal: Number,

    
    status: {
      type: String,
      enum: [
        "CREATED", // customer placed order
        "ACCEPTED", // vendor accepted
        "REJECTED", // vendor rejected
        "PREPARING", // cooking
        "READY", // ready for pickup
        "PICKED", // rider picked
        "DELIVERED", // customer received
        "CANCELLED", // admin/system
      ],
      default: "CREATED",
    },
    
    cancelledBy: {
      type: String,
      enum: ["CUSTOMER", "VENDOR", "ADMIN", "SYSTEM"],
      default: null,
    },
    
    cancelledAt: {
      type: Date,
      default: null,
    },
    pricing: {
      itemsTotal: Number, // sum of (price × quantity)
      deliveryFee: Number, // charged to customer
      vendorCommission: Number, // platform cut
      riderEarning: Number, // rider payout
      vendorEarning: Number, // vendor net
      platformEarning: Number, // your profit
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
