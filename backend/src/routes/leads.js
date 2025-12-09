const express = require('express');
const router = express.Router();

// GET all leads for a business
router.get('/my', (req, res) => {
  try {
    res.json({ leads: [], message: 'Leads endpoint placeholder' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new lead
router.post('/', (req, res) => {
  try {
    const newLead = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    res.status(201).json(newLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
