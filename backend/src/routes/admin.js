const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ endpoint: 'admin list' }));
router.post('/', (req, res) => res.json({ endpoint: 'admin created' }));
router.get('/:id', (req, res) => res.json({ endpoint: 'admin detail', id: req.params.id }));
router.put('/:id', (req, res) => res.json({ endpoint: 'admin updated', id: req.params.id }));
router.delete('/:id', (req, res) => res.json({ endpoint: 'admin deleted', id: req.params.id }));

module.exports = router;
