const express = require("express");
const { signup, login } = require("../controllers/auth");

const route = express.Router();

route.post("/signup", async (req, res) => {
  console.log(req.body);
  const { error } = await signup(req.body);
  if (error) {
    console.log(error);
    res.status(404).send(JSON.stringify(error));
  } else res.status(200).send("ok");
});

route.get("/login", async (req, res) => {
  const { error, jwtoken } = await login(req.body);
  if (error) {
    res.status(404).send(JSON.stringify(error));
  } else {
    res
      .status(200)
      .cookie("auth-token", jwtoken, { httpOnly: true })
      .send(jwtoken);
  }
});

route.get("/logout", async (req, res) => {
  res
    .cookie("auth-token", "", { httpOnly: true })
    .send({ success: "Logged-Out" });
});
module.exports = route;
