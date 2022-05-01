const express = require("express");
const route = express.Router();
const { searchAnyone, searchChats } = require("../controllers/search");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const tokenAuthenticator = require("../middlewares/tokenAuthenticator");
// const Group = require("../models/Group");

// to search anyone regardless you are their friend or not!!!
route.get("/all/:obj", tokenAuthenticator, searchAnyone);
// route.get("/all/:name", searchAnyone);

// to search anyone, or any group in the chats which you are member of!
route.get("/:obj", tokenAuthenticator, searchChats);
// route.get("/:obj", searchChats);

module.exports = route;
