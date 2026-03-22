const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: String,
  milletType: String,
  ingredients: [{ name: String, quantity: String }],
  steps: [String],
  tags: [String],
  cookTime: Number,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
  healthLabels: [String],
  nutritionalBreakdown: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fiber: Number,
    iron: Number
  },
  image: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'creatorModel' },
  creatorModel: { type: String, enum: ['User', 'Expert'] },
  isExpertRecipe: { type: Boolean, default: false },
  isAIGenerated: { type: Boolean, default: false },
  approvedStatus: { type: Boolean, default: false },
  preparationNotes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
