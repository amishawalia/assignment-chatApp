const {
  joinToRoomsOfUser,
  leaveFromTheRoomsOfUser,
  updateTheRoomsOfUser,
  updateTheGroupRoomsOfUser,
} = require("./socketHelper");
module.exports = (io) => {
  let users = new Map();
  let usersOppo = new Map();

  io.on("connect", async (socket) => {
    let rooms = [];
    console.log(socket.id, "connected");
    socket.on("online", async ({ _id, userName }, callback) => {
      users.set(socket.id, { _id, userName });
      console.log(users);
      if (!usersOppo.has(_id))
        usersOppo.set(_id, { socketId: socket.id, userName });
      else
        return callback({
          error:
            "You are being redirected to previous page since you are already online with another session",
        });
      const obj = await joinToRoomsOfUser(_id);
      rooms = obj.rooms;
      const alreadyOnline = obj.alreadyOnline;
      rooms.map((room) => {
        let id = room._id + "";
        console.log(id, "roomid joining");
        socket.join(id);
        if (!room.members) {
          socket.to(id).emit("friend-online", {
            id: _id,
            socketId: socket.id,
          });
        }
      });
      callback({ alreadyOnline });
    });
    socket.on("send-message", (payload) => {
      let { isGroup, senderId, roomId } = payload;
      console.log("in server send-message", payload);
      if (isGroup) {
        socket.to(roomId).emit("check-new-message", {
          idWithUpdate: roomId, //group id
          isGroup,
          idWhoSentTheMessage: senderId, //personaluser id
        });
      } else {
        console.log(roomId, "roomid");
        socket.to(roomId).emit("check-new-message", {
          idWithUpdate: roomId, //personalchat id
          isGroup,
          idWhoSentTheMessage: senderId, //personaluser id
        });
      }
      // return callback();
    });
    socket.on("new-room-creation", (obj, callback) => {
      rooms.push(updateTheRoomsOfUser(obj));
      let { personalChatId } = obj;
      personalChatId += "";
      socket.join(personalChatId);
      const socketIdOfOtherMemberIfPresent = usersOppo.has(
        rooms[rooms.length - 1].users[1]
      )
        ? usersOppo.get(rooms[rooms.length - 1].users[1]).socketId
        : null;
      socket
        .to(
          socketIdOfOtherMemberIfPresent
            ? socketIdOfOtherMemberIfPresent
            : personalChatId
        )
        .emit("friend-online", {
          id: obj.senderId + "",
          socketId: socket.id,
          newPersonalOnline: obj,
        });
      socketIdOfOtherMemberIfPresent
        ? callback({
            id: rooms[rooms.length - 1].users[1],
            socketId: socketIdOfOtherMemberIfPresent,
          })
        : callback({ id: null, socketId: null });
    });
    socket.on(
      "update-self-rooms",
      ({ personalChatId, recieverId, senderId }, callback) => {
        rooms.push({
          _id: personalChatId,
          users: [recieverId, senderId],
        });
        socket.join(personalChatId);
        callback();
      }
    );
    socket.on(
      "seen-the-last-message",
      (idToAcknowledge, isGroup, idWhoSentTheMessage) => {
        if (isGroup) {
          if (usersOppo.has(idWhoSentTheMessage)) {
            socket
              .to(usersOppo.get(idWhoSentTheMessage).socketId)
              .emit("your-last-message-is-seen", {
                inWhichChatId: idToAcknowledge,
                isGroup,
              });
          }
        } else {
          if (usersOppo.has(idWhoSentTheMessage))
            socket
              .to(usersOppo.get(idWhoSentTheMessage).socketId)
              .emit("your-last-message-is-seen", {
                inWhichChatId: users.get(socket.id)._id,
                isGroup,
              });
        }
      }
    );
    socket.on("new-group-creation", (roomData) => {
      let onlineMembersOfGroup = roomData.members.filter((_id) =>
        usersOppo.has(_id)
      );
      console.log(onlineMembersOfGroup);
      onlineMembersOfGroup = onlineMembersOfGroup.map((_id) => {
        return {
          _id,
          socketId: usersOppo.get(_id).socketId,
        };
      });
      console.log(onlineMembersOfGroup);
      rooms.push(updateTheGroupRoomsOfUser(onlineMembersOfGroup, roomData._id));
      socket.join(roomData._id + "");
      let onlineMembers = onlineMembersOfGroup.map(({ _id }) => {
        return _id + "";
      });
      onlineMembersOfGroup.map(({ _id, socketId }) => {
        socket
          .to(socketId)
          .emit("new-group-created", roomData._id, onlineMembers);
      });
    });
    socket.on("in-new-group", (_id, members) => {
      rooms.push({
        _id,
        members,
      });
      socket.join(_id);
    });
    socket.on("disconnect", () => {
      console.log(socket.id, "signing off");
      console.log(users.get(socket.id));
      rooms.map((room) => {
        id = room._id + "";
        if (!room.members) {
          let thisId = users.get(socket.id)._id;
          socket
            .to(id)
            .emit("friend-offline", { id: thisId, socketId: socket.id });
        }
        socket.leave(id);
      });
      leaveFromTheRoomsOfUser(rooms, users.get(socket.id)._id);
      usersOppo.delete(users.get(socket.id)._id);
      users.delete(socket.id);
    });
  });
};
