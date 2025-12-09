const Business = require('../models/Business');
const Review = require('../models/Review');

// Get all businesses
exports.getBusinesses = async (req, res) => {
  try {
    const { category, city, search } = req.query;
    let query = { isActive: true };
    
    if (category) query.category = category;
    if (city) query.city = city;
    if (search) query.$text = { $search: search };

    const businesses = await Business.find(query)
      .populate('owner', 'name email phone')
      .limit(100)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single business
exports.getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id)
      .populate('owner', 'name email phone')
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' }
      });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create business
exports.createBusiness = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const business = await Business.create(req.body);

    res.status(201).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update business
exports.updateBusiness = async (req, res) => {
  try {
    let business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this business' });
    }

    business = await Business.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete business
exports.deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this business' });
    }

    await business.remove();
    res.status(200).json({
      success: true,
      message: 'Business deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
