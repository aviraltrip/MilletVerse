const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'expert' },
  credentials: String,
  specialty: String,
  bio: String,
  profileImage: String,
  approvedStatus: { type: Boolean, default: false },
  submittedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expert', expertSchema);
