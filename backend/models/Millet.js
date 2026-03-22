const mongoose = require('mongoose');

const milletSchema = new mongoose.Schema({
  name: { type: String, required: true },
  localNames: [String],
  description: String,
  nutrients: {
    protein: Number,
    fiber: Number,
    iron: Number,
    calcium: Number,
    gi: Number,
    gl: Number,
    carbs: Number,
    calories: Number
  },
  conditions: [String],
  states: [String],
  season: String,
  forms: [String],
  image: String,
  benefits: [String],
  cautions: [String]
});

module.exports = mongoose.model('Millet', milletSchema);
