const express = require("express");
const {
  oldMessagesOfAChatRetriever,
  messageSender,
  recentChatsNameRetriever,
  lastMessageSeenStatusUpdater,
  allKonnectionsRetriever,
  newGroupMaker,
  groupInfoGiver,
  adminMaker,
  personalInfoGiver,
  selfInfoGiver,
} = require("../controllers/inbox");
const tokenAuthenticator = require("../middlewares/tokenAuthenticator");
const route = express.Router();

// to retrieve the old messages of a chat when clicked on
route.get("/chatbox/:obj", tokenAuthenticator, oldMessagesOfAChatRetriever);
// route.get("/chatbox/:obj", oldMessagesOfAChatRetriever);

// to post a new message
route.put("/chatbox/:obj", tokenAuthenticator, messageSender);
// route.put("/chatbox/:obj", messageSender);

route.put(
  "/chatbox/lastseen/:obj",
  tokenAuthenticator,
  lastMessageSeenStatusUpdater
);

// to retrieve old conversation names
route.get("/:id", tokenAuthenticator, recentChatsNameRetriever);
// route.get("/:id", recentChatsNameRetriever);

route.get("/friends/:id", tokenAuthenticator, allKonnectionsRetriever);

route.post("/makegroup", tokenAuthenticator, newGroupMaker);

route.get("/groupinfo/:id", tokenAuthenticator, groupInfoGiver);

route.put("/makeadmin/:groupInfo", tokenAuthenticator, adminMaker);

route.get("/personalinfo/:obj", tokenAuthenticator, personalInfoGiver);

route.get("/selfinfo/:userName", tokenAuthenticator, selfInfoGiver);
module.exports = route;
