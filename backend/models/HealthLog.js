const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  energyLevel: { type: Number, min: 1, max: 10 },
  digestion: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
  weight: Number,
  bloodSugar: Number,
  notes: String
});

module.exports = mongoose.model('HealthLog', healthLogSchema);
