const jwt = require("jsonwebtoken");

module.exports = async (userDetails, exp) => {
  return await jwt.sign(userDetails, process.env.SECRET, { expiresIn: exp });
};
