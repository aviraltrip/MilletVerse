const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  generatedDate: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
  items: [{
    millet: String,
    quantity: Number,
    form: String,
    timing: String,
    rationale: String
  }],
  downloadUrl: String,
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
