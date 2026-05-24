const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'expert', 'admin'], default: 'user' },
  healthProfile: {
    age: Number,
    weight: Number,
    height: Number,
    bmi: Number,
    bmiCategory: String,
    activityLevel: String,
    conditions: [String],
    labValues: {
      fastingBloodSugar: Number,
      postprandialSugar: Number,
      hemoglobin: Number
    }
  },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  healthLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthLog' }],
  phone: {
    type: String,
    trim: true,
    sparse: true // allows unique index lookup without colliding on null values
  },
  notificationPreferences: {
    smsEnabled: { type: Boolean, default: false }, // strictly opt-in
    categories: {
      dietPlans: { type: Boolean, default: true },
      appointments: { type: Boolean, default: true }
    }
  },
  onboardingComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
