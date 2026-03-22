const express = require('express');
const router = express.Router();
const { addLog, getLogs } = require('../controllers/healthLogController');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, addLog);
router.get('/', verifyToken, getLogs);

module.exports = router;
