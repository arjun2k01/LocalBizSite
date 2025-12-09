const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    },
    type: {
      type: String,
      enum: ['view', 'whatsapp_click', 'call_click', 'lead_submission'],
      required: true
    },
    ip: String,
    userAgent: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
