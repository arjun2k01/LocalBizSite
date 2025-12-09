const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    message: {
      type: String
    },
    source: {
      type: String,
      enum: ['contact_form', 'cta_button'],
      default: 'contact_form'
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
