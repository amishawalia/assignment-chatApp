const mongoose = require("mongoose");
const Group = require("../models/Group");
const Personal = require("../models/Personal");
const User = require("../models/User");

const oldMessagesOfAChatRetriever = async (req, res) => {
  const { _id1, _id2, isGroup } = JSON.parse(req.params.obj);
  let msgs = [];
  try {
    if (isGroup) {
      const groupChat = await Group.findOne({
        _id: _id2,
        members: _id1,
      });
      if (groupChat) msgs = groupChat.messages;
      else msgs = [];
    } else {
      const personalChats = await Personal.findOne({
        $or: [{ users: [_id1, _id2] }, { users: [_id2, _id1] }],
      });
      console.log(personalChats);
      if (personalChats) msgs = personalChats.messages;
      else msgs = [];
    }
    console.log(msgs);
    res.json(msgs);
  } catch (error) {
    res.json(msgs);
    console.log(error);
  }
};

const messageSender = async (req, res, next) => {
  const { _id1, _id2, isGroup } = JSON.parse(req.params.obj);
  console.log(req.body);
  const sendObj = req.body;
  console.log("--------", sendObj, req.body);
  let groupChat = null,
    personalChat = null,
    newPersonalChat = null;
  try {
    if (isGroup) {
      groupChat = await Group.findOneAndUpdate(
        {
          _id: _id2,
          members: _id1,
        },
        {
          $push: {
            messages: sendObj,
          },
          lastMessage: sendObj,
        }
      );
    } else {
      personalChat = await Personal.findOneAndUpdate(
        {
          $or: [{ users: [_id1, _id2] }, { users: [_id2, _id1] }],
        },
        {
          $push: {
            messages: sendObj,
          },
          lastMessage: sendObj,
        }
      );
      if (!personalChat) {
        newPersonalChat = new Personal({
          users: [_id1, _id2],
          messages: [sendObj],
          lastMessage: {
            ...sendObj,
          },
        });
        newPersonalChat = await newPersonalChat.save();
      }
    }

    res.json({ groupChat, personalChat, newPersonalChat });
  } catch (error) {
    res.json({ send: "no" });
    console.log(error);
  }
};

const lastMessageSeenStatusUpdater = async (req, res, next) => {
  const { _id1, _id2, isGroup } = JSON.parse(req.params.obj);
  let chat = {};
  try {
    if (isGroup) {
      chat = await Group.findOneAndUpdate(
        {
          _id: _id2,
          members: _id1,
        },
        { $set: { "lastMessage.isNotSeen": false } },
        { new: true }
      );
    } else {
      chat = await Personal.findOneAndUpdate(
        {
          $or: [{ users: [_id1, _id2] }, { users: [_id2, _id1] }],
        },
        { $set: { "lastMessage.isNotSeen": false } },
        { new: true }
      );
    }
    res.json({ done: true, chat });
  } catch (error) {
    res.json({ done: false, chat });
    console.log(error);
  }
};

const recentChatsNameRetriever = async (req, res, next) => {
  console.log("in recent chats");
  try {
    let personals = await Personal.find(
      { users: req.params.id },
      {
        users: 1,
        _id: 1,
        lastMessage: 1,
      }
    ).lean();
    const personalChat = await Promise.all(
      personals.map(async (val) => {
        let _id = {};
        if (mongoose.Types.ObjectId(req.params.id).equals(val.users[0])) {
          _id = val.users[1];
        } else _id = val.users[0];
        const name = await User.findOne({ _id }, { userName: 1 }).lean();
        console.log(name, "name");
        return {
          lastMessage: val.lastMessage,
          personalChatId: val._id,
          ...name,
        };
      })
    );
    const groupChats = await Group.find(
      { members: req.params.id },
      {
        name: 1,
        _id: 1,
        lastMessage: 1,
        admin: 1,
        publicId: 1,
      }
    );
    let recentChats = [...personalChat, ...groupChats].sort(
      (a, b) =>
        new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );
    console.log("recentchats----------", recentChats);
    res.json(recentChats);
  } catch (error) {
    res.json({ error: "ok" });
  }
};

const findRoomsOfAUser = async (_id) => {
  try {
    const personalRooms = await Personal.find(
      { users: mongoose.Types.ObjectId(_id) },
      { _id: 1, users: 1 }
    );
    const groupRooms = await Group.find(
      {
        members: mongoose.Types.ObjectId(_id),
      },
      { _id: 1, members: 1 }
    );
    return [...personalRooms, ...groupRooms];
  } catch (error) {
    console.log("error");
    return [];
  }
};

const allKonnectionsRetriever = async (req, res, next) => {
  const _id = req.params.id;
  try {
    let users = await User.find(
      {
        // konnections: _id,
      },
      { userName: 1, _id: 1 }
    ).lean();
    users = users.filter((u) => u._id !== _id);
    res.json(users);
  } catch (error) {
    res.json([]);
    console.log(error);
  }
};

const newGroupMaker = async (req, res, next) => {
  const {
    members,
    groupAbout,
    groupBatch,
    groupBranch,
    groupName,
    admin,
    adminName,
  } = req.body;
  try {
    const file = req.files.file;
    console.log(file);
    let result = await uploadFromBuffer(file, "group-images");
    const group = new Group({
      name: groupName,
      batch: groupBatch,
      branch: groupBranch,
      admin: [admin],
      members,
      about: groupAbout,
      lastMessage: {
        _id: admin,
        sender: adminName,
        message: `New group`,
        timestamp: new Date(),
        isNotSeen: true,
      },
      publicId: result.public_id,
    });
    const newGroup = await group.save();
    const users = await Promise.all(
      newGroup.members.map(async (member) => {
        return await User.findByIdAndUpdate(
          member,
          { $push: { groupChats: mongoose.Types.ObjectId(newGroup._id) } },
          { useFindAndModify: false }
        );
      })
    );
    console.log("ok");
    res.json(newGroup);
  } catch (error) {
    console.log("error", error);
    res.json({ success: "no" });
  }
};

const groupInfoGiver = async (req, res, next) => {
  const _id = req.params.id;
  try {
    const group = await Group.findOne({ _id })
      .lean()
      .populate("members", "_id name")
      .populate("admin", "_id name");
    console.log(group);
    res.json({
      groupName: group.name,
      groupBranch: group.branch,
      groupBatch: group.batch,
      groupAbout: group.about,
      admin: group.admin,
      members: group.members,
      publicId: group.publicId ? group.publicId : "undefined",
    });
  } catch (error) {
    res.json({
      groupName: "",
      groupBranch: "",
      groupBatch: "",
      groupAbout: "",
      admin: [],
      members: [],
      publicId: group.publicId,
    });
    console.log(error);
  }
};

const adminMaker = async (req, res, next) => {
  const { _id, admins } = JSON.parse(req.params.groupInfo);
  try {
    const group = await Group.updateOne(
      { _id: mongoose.Types.ObjectId(_id) },
      { $push: { admin: admins } }
    );
    console.log(group, "group");
    res.json({ success: "ok" });
  } catch (error) {
    console.log(error);
    res.json({ success: "no" });
  }
};

const personalInfoGiver = async (req, res, next) => {
  const { selfId, idOfPerson } = JSON.parse(req.params.obj);

  try {
    const users = await User.findOne(
      { _id: idOfPerson },
      {
        name: 1,
        email: 1,
        lib: 1,
        isStudent: 1,
        branch: 1,
        batch: 1,
        groupChats: 1,
        inboxStatus: 1,
      }
    )
      .populate("groupChats", "_id members name publicId")
      .lean();
    let groupsInCommon = [];
    users.groupChats.map((group) => {
      if (
        group.members.findIndex((_id) =>
          mongoose.Types.ObjectId(_id).equals(mongoose.Types.ObjectId(selfId))
        ) !== -1
      ) {
        groupsInCommon.push({
          _id: group._id,
          name: group.name,
          publicId: group.publicId,
        });
      }
    });
    let { groupChats, ...userInfo } = users;
    userInfo = { ...userInfo, groupsInCommon };
    res.json(userInfo);
  } catch (error) {
    console.log(error);
    res.json({
      name: "",
      email: "",
      lib: "",
      isStudent: "",
      branch: "",
      batch: "",
      inboxStatus: "",
      groupsInCommon: [],
    });
  }
};

module.exports = {
  oldMessagesOfAChatRetriever,
  messageSender,
  lastMessageSeenStatusUpdater,
  recentChatsNameRetriever,
  findRoomsOfAUser,
  allKonnectionsRetriever,
  newGroupMaker,
  groupInfoGiver,
  adminMaker,
  personalInfoGiver,
};
