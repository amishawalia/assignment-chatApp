const { findRoomsOfAUser } = require("./inbox");
const onlineRooms = new Map();

const joinToRoomsOfUser = async (id) => {
  const rooms = await findRoomsOfAUser(id);
  let alreadyOnlineRedundent = [],
    alreadyOnline;
  rooms.map((val) => {
    const _id = val._id + "";
    if (!onlineRooms.has(_id)) {
      onlineRooms.set(_id, [id]);
    } else {
      alreadyOnlineRedundent.push(
        ...onlineRooms.get(_id).filter((user) => user !== id)
      );
      onlineRooms.get(_id).push(id);
    }
  });
  alreadyOnline = new Set(alreadyOnlineRedundent);
  alreadyOnline = Array.from(alreadyOnline);
  return { alreadyOnline, rooms };
};

const leaveFromTheRoomsOfUser = (rooms, userId) => {
  rooms.map(({ _id }) => {
    _id = _id + "";
    if (onlineRooms.has(_id)) {
      onlineRooms.set(
        _id,
        onlineRooms.get(_id).filter((_id) => userId !== _id)
      );
      if (!onlineRooms.get(_id).length) onlineRooms.delete(_id);
    }
  });
};

const updateTheRoomsOfUser = ({ personalChatId, senderId, receiverId }) => {
  personalChatId += "";
  senderId += "";
  receiverId += "";
  onlineRooms.set(personalChatId, [senderId, receiverId]);
  return {
    _id: personalChatId,
    users: [senderId, receiverId],
  };
};

const updateTheGroupRoomsOfUser = (membersIds, groupId) => {
  groupId += "";
  membersIds = membersIds.map(({ _id }) => _id + "");
  onlineRooms.set(groupId, membersIds);
  return {
    _id: groupId,
    members: membersIds,
  };
};
module.exports = {
  joinToRoomsOfUser,
  leaveFromTheRoomsOfUser,
  updateTheRoomsOfUser,
  updateTheGroupRoomsOfUser,
};
