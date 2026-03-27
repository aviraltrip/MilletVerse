const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Expert = require('../models/Expert');

const generateTokens = (user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '24h' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === 'expert') {
      return res.status(403).json({ success: false, message: 'Expert registration is restricted to administrators' });
    }

    if (!['user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    const UserDoc = role === 'expert' ? Expert : User;

    let existingUser = await UserDoc.findOne({ email });
    if (!existingUser && role === 'user') {
       existingUser = await Expert.findOne({ email });
    } else if (!existingUser && role === 'expert') {
       existingUser = await User.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new UserDoc({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    const { accessToken, refreshToken } = generateTokens(newUser);
    
    // In production we should set domain and secure true
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      accessToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        approvedStatus: newUser.approvedStatus
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check for fixed admin credentials
    if (email === 'admin@example.com' && password === 'admin123') {
      const { accessToken, refreshToken } = generateTokens({ _id: 'admin_fixed_id', role: 'admin' });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      return res.json({
        success: true,
        accessToken,
        user: {
          id: 'admin_fixed_id',
          name: 'System Admin',
          email: 'admin@example.com',
          role: 'admin'
        }
      });
    }

    let user = await User.findOne({ email });
    if (!user) user = await Expert.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvedStatus: user.approvedStatus
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.refresh = (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ success: false, message: 'Invalid refresh token' });

      // Issue new access token
      const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ success: true, accessToken });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('refreshToken', { httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
};
