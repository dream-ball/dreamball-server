const crypto = require('crypto');

/**
 * Generate a secure user token
 * @param {number} length
 * @returns {string} - A randomly generated token.
 */
function generateUser_id(length = 8) {
  return crypto.randomBytes(length).toString('hex');
}


module.exports={generateUser_id};