const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a listing title'],
    trim: true,
    maxlength: [150, 'Title cannot exceed 150 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  category: {
    type: String,
    enum: ['product', 'service', 'event', 'promotion', 'job', 'other'],
    default: 'product'
  },
  price: {
    type: Number,
    default: null
  },
  discountPrice: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  images: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  featureExpiry: Date,
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  likeCount: {
    type: Number,
    default: 0
  },
  expiryDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String],
  location: {
    latitude: Number,
    longitude: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster queries
listingSchema.index({ business: 1 });
listingSchema.index({ category: 1 });
listingSchema.index({ isFeatured: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Listing', listingSchema);
