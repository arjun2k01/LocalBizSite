const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ endpoint: 'listings list' }));
router.post('/', (req, res) => res.json({ endpoint: 'listings created' }));
router.get('/:id', (req, res) => res.json({ endpoint: 'listings detail', id: req.params.id }));
router.put('/:id', (req, res) => res.json({ endpoint: 'listings updated', id: req.params.id }));
router.delete('/:id', (req, res) => res.json({ endpoint: 'listings deleted', id: req.params.id }));

module.exports = router;
