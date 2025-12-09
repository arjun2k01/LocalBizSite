const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    key: {
      type: String,
      unique: true,
      lowercase: true,
      required: true
    },
    priceMonthly: {
      type: Number,
      default: 0
    },
    priceYearly: {
      type: Number,
      default: 0
    },
    limits: {
      maxGalleryImages: { type: Number, default: 10 },
      maxServices: { type: Number, default: 5 },
      analyticsAccess: { type: Boolean, default: false },
      customDomain: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Plan', planSchema);
