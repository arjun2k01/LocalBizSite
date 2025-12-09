const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ endpoint: 'businesses list' }));
router.post('/', (req, res) => res.json({ endpoint: 'businesses created' }));
router.get('/:id', (req, res) => res.json({ endpoint: 'businesses detail', id: req.params.id }));
router.put('/:id', (req, res) => res.json({ endpoint: 'businesses updated', id: req.params.id }));
router.delete('/:id', (req, res) => res.json({ endpoint: 'businesses deleted', id: req.params.id }));

module.exports = router;
