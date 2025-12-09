const express = require('express');
const { Lead, Business } = require('../models');
const { auth } = require('../middleware');

const router = express.Router();

// POST /leads - Create a new lead (public)
router.post('/', async (req, res) => {
  try {
    const { businessId, name, email, phone, message } = req.body;

    // Validate business exists and is published
    const business = await Business.findById(businessId);
    if (!business || !business.isPublished || !business.isActive) {
      return res.status(400).json({ message: 'Business not found or not published' });
    }

    // Create lead
    const lead = new Lead({
      business: businessId,
      name,
      email,
      phone,
      message,
      source: 'contact_form'
    });

    await lead.save();

    // Increment business lead stats
    business.stats.totalLeadSubmissions = (business.stats.totalLeadSubmissions || 0) + 1;
    await business.save();

    res.json({ success: true, leadId: lead._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /leads/my - Get leads for owner's business (protected)
router.get('/my', auth, async (req, res) => {
  try {
    const business = await Business.findOne({ owner: req.user.id });
    if (!business) {
      return res.status(404).json({ message: 'No business found' });
    }

    const leads = await Lead.find({ business: business._id }).sort({ createdAt: -1 });
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
