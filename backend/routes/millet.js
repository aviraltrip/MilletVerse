const express = require('express');
const router = express.Router();
const { getMillets, getMilletById } = require('../controllers/milletController');

router.get('/', getMillets);
router.get('/:id', getMilletById);

module.exports = router;
