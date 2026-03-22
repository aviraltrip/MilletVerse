const Expert = require('../models/Expert');

const isExpert = async (req, res, next) => {
  if (req.user && req.user.role === 'expert') {
    try {
      const expert = await Expert.findById(req.user.id);
      if (expert && expert.approvedStatus === true) {
        next();
      } else {
        res.status(403).json({ success: false, message: 'Access denied. Expert account not approved.' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Expert role required.' });
  }
};

module.exports = isExpert;
