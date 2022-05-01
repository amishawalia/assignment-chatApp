const Group = require("../models/Group");
const User = require("../models/User");
const Personal = require("../models/Personal");

const searchAnyone = async (req, res) => {
  let { _id, search } = JSON.parse(req.params.obj);
  search = search.trim();
  try {
    let name = new RegExp(search, "i");
    let users = await User.find(
      {
        userName: { $regex: name },
      },
      { userName: 1, _id: 1 }
    ).lean();
    users = users.filter((u) => String(u._id) !== _id);
    console.log(users);
    let personalChats = await Promise.all(
      users.map(async (val) => {
        const lastMessage = await Personal.findOne(
          {
            $or: [{ users: [_id, val._id] }, { users: [val._id, _id] }],
          },
          { lastMessage: 1, _id: 1 }
        ).lean();

        if (!lastMessage) {
          return {
            lastMessage: null,
            personalChatId: null,
            ...val,
          };
        }

        return {
          lastMessage: lastMessage.lastMessage,
          personalChatId: lastMessage._id,
          ...val,
        };
      })
    );
    const groups = await Group.find(
      {
        name: { $regex: name },
        members: _id,
      },
      {
        name: 1,
        _id: 1,
        admin: 1,
        lastMessage: 1,
      }
    ).lean();
    const totalResult = [...personalChats, ...groups];
    res.json(totalResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const searchChats = async (req, res, next) => {
  let { _id, search } = JSON.parse(req.params.obj);
  search = search.trim();
  try {
    let name = new RegExp(search, "i");
    let users = await User.find(
      {
        name: { $regex: name },
        konnections: _id,
      },
      { name: 1, _id: 1 }
    ).lean();

    let personalChats = await Promise.all(
      users.map(async (val) => {
        const lastMessage = await Personal.findOne(
          {
            $or: [{ users: [_id, val._id] }, { users: [val._id, _id] }],
          },
          { lastMessage: 1, _id: 1 }
        ).lean();

        if (!lastMessage) {
          return {
            lastMessage: null,
            personalChatId: null,
            ...val,
          };
        }

        return {
          lastMessage: lastMessage.lastMessage,
          personalChatId: lastMessage._id,
          ...val,
        };
      })
    );
    const groups = await Group.find(
      {
        name: { $regex: name },
        members: _id,
      },
      {
        name: 1,
        _id: 1,
        admin: 1,
        lastMessage: 1,
      }
    ).lean();
    const totalResult = [...personalChats, ...groups];
    res.json(totalResult);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const allPersonalsAndGroups = async (req, res) => {
  let { _id, search } = JSON.parse(req.params.obj);
  search = search.trim();
  try {
    let name = new RegExp(search, "i");
    let users = await User.find(
      {
        name: { $regex: name },
        konnections: _id,
      },
      { name: 1, _id: 1 }
    ).lean();

    let personalChats = await Promise.all(
      users.map(async (val) => {
        const lastMessage = await Personal.findOne(
          {
            $or: [{ users: [_id, val._id] }, { users: [val._id, _id] }],
          },
          { lastMessage: 1, _id: 0 }
        ).lean();
        return {
          ...lastMessage,
          ...val,
        };
      })
    );
    const groups = await Group.find(
      {
        name: { $regex: name },
        members: _id,
      },
      {
        name: 1,
        _id: 1,
        admin: 1,
        lastMessage: 1,
      }
    ).lean();
    const totalResult = [...personalChats, ...groups];
    res.json(totalResult);
  } catch (error) {
    res.send(error);
  }
};

module.exports = { searchAnyone, searchChats };
