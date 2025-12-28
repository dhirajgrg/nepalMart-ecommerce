const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one store per vendor
    },

    name: {
      type: String,
      required: true,
    },

    description: String,

    isOpen: {
      type: Boolean,
      default: false,
    },

    commissionRate: {
      type: Number,
      default: 20, // % admin commission
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
