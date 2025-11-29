const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (payload) => {
  // payload: { id: user._id, role: user.role, email: user.email }
  // token expiration: 1 hour (adjust as needed)
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = generateToken;