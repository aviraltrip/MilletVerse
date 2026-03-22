const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const prescriptionController = require('../controllers/prescriptionController');

router.post('/generate', verifyToken, prescriptionController.generatePrescription);
router.get('/mine', verifyToken, prescriptionController.getMyPrescriptions);

module.exports = router;
