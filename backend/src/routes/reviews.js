const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ endpoint: 'reviews list' }));
router.post('/', (req, res) => res.json({ endpoint: 'reviews created' }));
router.get('/:id', (req, res) => res.json({ endpoint: 'reviews detail', id: req.params.id }));
router.put('/:id', (req, res) => res.json({ endpoint: 'reviews updated', id: req.params.id }));
router.delete('/:id', (req, res) => res.json({ endpoint: 'reviews deleted', id: req.params.id }));

module.exports = router;
