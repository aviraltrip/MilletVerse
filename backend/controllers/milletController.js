const Millet = require('../models/Millet');

// @desc    Get all millets
// @route   GET /api/millets
// @access  Public
exports.getMillets = async (req, res) => {
  try {
    const millets = await Millet.find({});
    res.status(200).json(millets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching millets.' });
  }
};

// @desc    Get single millet by ID
// @route   GET /api/millets/:id
// @access  Public
exports.getMilletById = async (req, res) => {
  try {
    const millet = await Millet.findById(req.params.id);
    if (!millet) {
      return res.status(404).json({ message: 'Millet not found' });
    }
    res.status(200).json(millet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching millet details.' });
  }
};
