const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ endpoint: 'analytics list' }));
router.post('/', (req, res) => res.json({ endpoint: 'analytics created' }));
router.get('/:id', (req, res) => res.json({ endpoint: 'analytics detail', id: req.params.id }));
router.put('/:id', (req, res) => res.json({ endpoint: 'analytics updated', id: req.params.id }));
router.delete('/:id', (req, res) => res.json({ endpoint: 'analytics deleted', id: req.params.id }));

module.exports = router;
