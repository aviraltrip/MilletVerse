const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { bookAppointment, getMyAppointments } = require('../controllers/appointmentController');

router.post('/', verifyToken, bookAppointment);
router.get('/mine', verifyToken, getMyAppointments);

module.exports = router;
