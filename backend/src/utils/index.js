const { generateToken, verifyToken, getTokenFromRequest } = require('./jwt');

module.exports = {
  generateToken,
  verifyToken,
  getTokenFromRequest
};
