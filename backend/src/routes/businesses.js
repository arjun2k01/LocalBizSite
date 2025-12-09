const express = require('express');
const router = express.Router();

// Mock data for testing
const mockBusinesses = [
  {
    id: '1',
    name: 'Coffee House Delite',
    slug: 'coffee-house-delite',
    description: 'Best coffee shop in town',
    phone: '+1-555-0101',
    email: 'info@coffeehouse.com',
    address: '123 Main St, Springfield',
    city: 'Springfield',
    category: 'Cafe',
    image: 'https://via.placeholder.com/300x200?text=Coffee+House'
  },
  {
    id: '2',
    name: 'Local Pizza Palace',
    slug: 'local-pizza-palace',
    description: 'Authentic Italian pizza',
    phone: '+1-555-0102',
    email: 'info@pizzapalace.com',
    address: '456 Oak Ave, Springfield',
    city: 'Springfield',
    category: 'Restaurant',
    image: 'https://via.placeholder.com/300x200?text=Pizza+Palace'
  },
  {
    id: '3',
    name: 'Sunny Salon Studio',
    slug: 'sunny-salon-studio',
    description: 'Premium hair and beauty services',
    phone: '+1-555-0103',
    email: 'info@sunnysalon.com',
    address: '789 Pine Rd, Springfield',
    city: 'Springfield',
    category: 'Salon',
    image: 'https://via.placeholder.com/300x200?text=Salon+Studio'
  }
];

// GET all businesses
router.get('/', (req, res) => {
  try {
    // Return mock data
    res.json(mockBusinesses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single business by ID
router.get('/:id', (req, res) => {
  try {
    const business = mockBusinesses.find(b => b.id === req.params.id);
    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create business
router.post('/', (req, res) => {
  try {
    const newBusiness = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    mockBusinesses.push(newBusiness);
    res.status(201).json(newBusiness);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update business
router.put('/:id', (req, res) => {
  try {
    const index = mockBusinesses.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Business not found' });
    }
    mockBusinesses[index] = { ...mockBusinesses[index], ...req.body };
    res.json(mockBusinesses[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE business
router.delete('/:id', (req, res) => {
  try {
    const index = mockBusinesses.findIndex(b => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Business not found' });
    }
    const deleted = mockBusinesses.splice(index, 1);
    res.json(deleted[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
