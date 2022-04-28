const express = require("express");
const { signup, login } = require("../controllers/auth");
const tokenAuthenticator = require("../middlewares/tokenAuthenticator");

const route = express.Router();

route.get("/", tokenAuthenticator, async (req, res) => {
  res.send("ok");
});

module.exports = route;
