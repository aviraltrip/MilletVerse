const mongoose = require('mongoose');

const healthMappingSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  recommendedMillets: [String],
  avoidMillets: [String],
  quantityGuidelines: {
    light: String,
    moderate: String,
    intensive: String
  },
  forms: [String],
  timing: { morning: Boolean, afternoon: Boolean, evening: Boolean },
  rationale: String,
  relatedLabValues: [String]
});

module.exports = mongoose.model('HealthMapping', healthMappingSchema);
