const HealthLog = require('../models/HealthLog');

// @desc    Add a health log
// @route   POST /api/health-logs
// @access  Private
exports.addLog = async (req, res) => {
  try {
    const { energyLevel, digestion, weight, bloodSugar, notes, date } = req.body;
    
    const newLog = new HealthLog({
      userId: req.user.id,
      date: date ? new Date(date) : new Date(),
      energyLevel,
      digestion,
      weight,
      bloodSugar,
      notes
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving log.' });
  }
};

// @desc    Get user's health logs
// @route   GET /api/health-logs
// @access  Private
exports.getLogs = async (req, res) => {
  try {
    const logs = await HealthLog.find({ userId: req.user.id }).sort('date');
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching logs.' });
  }
};
