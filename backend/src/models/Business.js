const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a business name'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['retail', 'service', 'restaurant', 'healthcare', 'education', 'entertainment', 'other'],
    default: 'other'
  },
  address: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  phone: String,
  email: String,
  website: String,
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  logo: String,
  banner: String,
  images: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiry: Date,
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
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
businessSchema.index({ owner: 1 });
businessSchema.index({ category: 1 });
businessSchema.index({ city: 1 });
businessSchema.index({ name: 'text', description: 'text' });

// Update rating when reviews change
businessSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { business: this._id } },
    { $group: { _id: '$business', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (result.length > 0) {
    this.rating = result[0].avgRating;
    this.reviewCount = result[0].count;
  } else {
    this.rating = 0;
    this.reviewCount = 0;
  }
  await this.save();
};

module.exports = mongoose.model('Business', businessSchema);
