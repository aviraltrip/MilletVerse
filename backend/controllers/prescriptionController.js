const User = require('../models/User');
const Prescription = require('../models/Prescription');
const HealthMapping = require('../models/HealthMapping');

exports.generatePrescription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      age, weight, height, activityLevel, 
      conditions = [], labValues = {} 
    } = req.body;

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    let bmiCategory = 'Normal';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else if (bmi >= 30) bmiCategory = 'Obese';

    // Update User Profile
    await User.findByIdAndUpdate(userId, {
      $set: {
        'healthProfile.age': age,
        'healthProfile.weight': weight,
        'healthProfile.height': height,
        'healthProfile.bmi': bmi,
        'healthProfile.bmiCategory': bmiCategory,
        'healthProfile.activityLevel': activityLevel,
        'healthProfile.conditions': conditions,
        'healthProfile.labValues': labValues,
        onboardingComplete: true
      }
    });

    // Generate Prescription
    const prescriptionItems = [];
    
    // Default fallback if no conditions
    if (conditions.length === 0) {
      prescriptionItems.push({
        millet: "finger millet",
        quantity: 80,
        form: "porridge or whole grain",
        timing: "morning",
        rationale: "General wellness and sustained energy."
      });
      if (bmi >= 30) {
        prescriptionItems.push({
           millet: "barnyard millet",
           quantity: 60,
           form: "whole grain",
           timing: "afternoon",
           rationale: "Low calorie option for weight management."
        });
      }
    } else {
      for (const condition of conditions) {
        const mapping = await HealthMapping.findOne({ condition: condition.toLowerCase() });
        if (mapping) {
          // Simplified logic: pick the first recommended millet
          const primaryMillet = mapping.recommendedMillets[0] || 'finger millet';
          const form = mapping.forms[0] || 'whole grain';
          const timingKeys = Object.keys(mapping.timing || {}).filter(k => mapping.timing[k]);
          const timing = timingKeys.length > 0 ? timingKeys[0] : 'morning';
          
          let quantity = 80;
          let rationale = mapping.rationale || `Recommended for ${condition}.`;

          // Cross-reference lab values and BMI
          if (condition === 'diabetes' && labValues.fastingBloodSugar > 126) {
            quantity = 90;
            rationale += " Increased dosage due to elevated fasting blood sugar.";
          }
          if (condition === 'anemia' && labValues.hemoglobin && labValues.hemoglobin < 11) {
             quantity = 100;
             rationale += " Increased dosage and sprouted form prioritized for low hemoglobin.";
          }
          if (bmi >= 30) {
             quantity = Math.floor(quantity * 0.85); // reduce 15%
             rationale += " Quantity reduced by 15% and calorie density prioritized due to BMI > 30.";
          }

          prescriptionItems.push({
            millet: primaryMillet,
            quantity,
            form,
            timing,
            rationale
          });
        }
      }
    }

    // Versioning logic
    const existingPrescriptions = await Prescription.find({ userId }).sort({ version: -1 });
    const nextVersion = existingPrescriptions.length > 0 ? existingPrescriptions[0].version + 1 : 1;

    // Mark others as inactive
    await Prescription.updateMany({ userId }, { $set: { isActive: false } });

    const newPrescription = new Prescription({
      userId,
      version: nextVersion,
      items: prescriptionItems,
      isActive: true
    });

    await newPrescription.save();

    res.json({ success: true, prescription: newPrescription, bmi, bmiCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate prescription', error: error.message });
  }
};

exports.getMyPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
