const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'List users' }));
router.get('/:id', (req, res) => res.json({ message: 'Get user', id: req.params.id }));
router.post('/', (req, res) => res.json({ message: 'Create user', status: 'created' }));
router.put('/:id', (req, res) => res.json({ message: 'Update user', id: req.params.id }));
router.delete('/:id', (req, res) => res.json({ message: 'Delete user', id: req.params.id }));

module.exports = router;
