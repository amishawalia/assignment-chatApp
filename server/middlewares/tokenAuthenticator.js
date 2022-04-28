const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.cookies["auth-token"];
  try {
    const verified = await jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    res.send({ token: "Invalid" });
  }
};
