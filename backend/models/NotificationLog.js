const mongoose = require('mongoose');

const notificationLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  channel: { type: String, enum: ['sms'], default: 'sms' },
  type: { type: String, enum: ['diet_plan', 'appointment_confirmation', 'appointment_reminder'], required: true },
  recipient: { type: String, required: true }, // Destination phone in +E.164 format
  content: { type: String, required: true },
  status: { type: String, enum: ['sent', 'failed'], required: true },
  twilioSid: String,
  error: String,
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NotificationLog', notificationLogSchema);
