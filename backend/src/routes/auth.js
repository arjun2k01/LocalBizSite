const express = require('express');
const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint', status: 'ok' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint', status: 'ok' });
});

router.get('/me', (req, res) => {
  res.json({ message: 'Get user endpoint', status: 'ok' });
});

module.exports = router;
