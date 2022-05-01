import Messenger from "../../components/Messenger/Messenger";
import Topbar from "../../components/Topbar/Topbar";
import { io } from "socket.io-client";
import { useState, useEffect, useCallback, useRef, createContext } from "react";
import axios from "../../axios";
let socket;

const PropsToPassToConversation = createContext();
const PropsToPassToChat = createContext();
const PropsToPassToFriendsLists = createContext();

const Home = ({ userName, _id }) => {
  const [search, setSearch] = useState("");
  const [matches, setMatches] = useState([]);
  const [active, setActive] = useState(false);
  const [oldChatsArray, setOldChatsArray] = useState([]);
  const activeInfo = useRef(false);
  const [oldConvoArray, setOldConvoArray] = useState([]);
  const [array, setArray] = useState([]);
  const [isGroup, setIsGroup] = useState(false);
  const [showComponents, setShowComponents] = useState({
    personalInfo: false,
    groupInfo: false,
    makeGroup: false,
  });
  const [totalOnlineUsersCurrently, setTotalOnlineUsersCurrently] = useState(
    new Map()
  );
  const [error, setError] = useState(false);
  const [friends, setfriends] = useState([]);
  const [authenticated, setAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);
  //   const history = useHistory();
  const ENDPOINT = "http://localhost:5000";

  // to make a websocket connection to the server
  useEffect(() => {
    console.log("Socket instance");
    socket = io(ENDPOINT, {
      transports: ["websocket"],
      upgrade: false,
      autoConnect: true,
      reconnection: true,
    });
    socket._id = _id;
    socket.emit("Dsc");
    socket.emit("online", { _id, userName }, (callbackObj) => {
      let onlineUsers = new Map();
      if (callbackObj.error) {
        setError(callbackObj.error);
        setTimeout(() => {
          //   history.goBack();
        }, 4000);
      } else if (callbackObj.alreadyOnline) {
        const { alreadyOnline } = callbackObj;
        alreadyOnline.map((user) => onlineUsers.set(user, 1));
        setTotalOnlineUsersCurrently(onlineUsers);
      }
    });
    socket.on("connect", () => console.log(socket.connected));
    return () => {
      console.log("Disconnecting");
      socket.disconnect();
    };
  }, [_id, userName]);

  // to search friend chats
  useEffect(() => {
    const searchName = async (e) => {
      try {
        if (search) {
          let obj = JSON.stringify({
            _id,
            search,
          });
          const users = await axios.get(`/search/all/${obj}`);
          if (users.data.token) setAuthenticated(false);
          console.log("in searchname", users.data);
          setMatches(users.data);
        } else {
          setMatches([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    setTimeout(() => {
      searchName();
    }, 200);
  }, [search]);

  useEffect(() => {
    (async () => {
      try {
        const friends = await axios.get(`inbox/${_id}`);
        if (friends.data.token) setAuthenticated();
        console.log(friends.data);
        console.log("inside");
        setfriends(friends.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [_id]);

  //   to retain the updated list of recent conversations
  const retainOldConversations = useCallback(async () => {
    try {
      const chats = await axios.get(`/inbox/${_id}`);
      if (chats.data.token) setAuthenticated(false);
      setOldConvoArray(chats.data);
      // setArray(chats.data);
      // setfriends(chats.data);
      console.log("in retain old convo", chats.data);
    } catch (error) {}
  }, [_id, setOldConvoArray]);

  useEffect(() => {
    if (!search.length) {
      retainOldConversations();
    }
  }, [retainOldConversations, search.length]);

  //   // to retain the old messages of a chat
  const retainOldMessages = useCallback(async (_id2, isGroup) => {
    let chat = {};
    try {
      const obj = JSON.stringify({
        _id1: _id,
        _id2,
        isGroup,
      });
      chat = await axios.get(`/inbox/chatbox/${obj}`);
      console.log(chat.data);
      if (chat.data.token) setAuthenticated(false);
      if (chat.data.length !== 0) {
        setOldChatsArray(chat.data);
        console.log(chat.data);
      } else {
        setOldChatsArray([]);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  //   // to update the recent conversation regarding online users
  const updatingOnlineStatusOfUsers = useCallback(
    (arrayOfConversations, S) => {
      arrayOfConversations = arrayOfConversations.map((element) => {
        if (totalOnlineUsersCurrently.has(element._id)) {
          return {
            ...element,
            isOnline: true,
          };
        } else {
          return { ...element, isOnline: false };
        }
      });
      console.log("in updating oline", arrayOfConversations);
      return arrayOfConversations;
    },
    [totalOnlineUsersCurrently]
  );

  useEffect(() => {
    setfriends(updatingOnlineStatusOfUsers(oldConvoArray, "saada"));
  }, [updatingOnlineStatusOfUsers, oldConvoArray]);

  // const changeSeenStatusOfLastMessage = useCallback(
  //   async (_id2, isGroup) => {
  //     try {
  //       const sendInfo = JSON.stringify({
  //         _id1: _id,
  //         _id2,
  //         isGroup,
  //       });
  //       let users = await axios.put(`/inbox/chatbox/lastseen/${sendInfo}`, {
  //         seen: true,
  //       });
  //       if (users.data.token) setAuthenticated(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   },
  //   [_id]
  // );

  // const seenProcedure = useCallback(
  //   async (idWithUpdate, isGroup, idWhoSentTheMessage) => {
  //     await changeSeenStatusOfLastMessage(idWithUpdate, isGroup);
  //     socket.emit(
  //       "seen-the-last-message",
  //       idWithUpdate, //idToAcknowledge(groupchat id or personaluserid) val._id
  //       isGroup, //isGroup  val.admin ? true : false
  //       idWhoSentTheMessage //personaluser id  val.lastmessage.sender !== name then
  //     );
  //     await retainOldConversations();
  //     setArray((prev) => {
  //       const index = prev.findIndex((val) => val._id === idWhoSentTheMessage);
  //       if (index !== -1) {
  //         prev[index].lastMessage.isNotSeen = false;
  //       }
  //       return [...prev];
  //     });
  //   },
  //   [changeSeenStatusOfLastMessage, retainOldConversations]
  // );

  useEffect(() => {
    console.log("Socket ons");
    // event that triggers when a friend comes online
    socket.on("friend-online", (onlineStuff) => {
      console.log("friend-online");
      const { id } = onlineStuff;
      setTotalOnlineUsersCurrently((prevVal) => {
        let onlineUsers = new Map(prevVal);
        onlineUsers.set(id, 1);
        return onlineUsers;
      });
      if (onlineStuff.newPersonalOnline) {
        const {
          newPersonalOnline: { personalChatId, senderId, receiverId },
        } = onlineStuff;
        setTotalOnlineUsersCurrently((prevVal) => {
          let onlineUsers = new Map(prevVal);
          onlineUsers.set(senderId, 1);
          return onlineUsers;
        });
        socket.emit(
          "update-self-rooms",
          {
            personalChatId,
            receiverId,
            senderId,
          },
          () => {
            console.log("update-self-rooms");
          }
        );
      }
    });

    // event that triggers when a friend goes offline
    socket.on("friend-offline", ({ id, socketId }) => {
      console.log("friend-offline");
      setTotalOnlineUsersCurrently((prevVal) => {
        let onlineUsers = new Map(prevVal);
        onlineUsers.delete(id);
        return onlineUsers;
      });
    });

    //   event when there is an incoming message
    socket.on(
      "check-new-message",
      async ({ idWithUpdate, isGroup, idWhoSentTheMessage }) => {
        console.log("check-new-message");
        if (
          isGroup
            ? idWithUpdate === activeInfo.current._id
            : idWithUpdate === activeInfo.current.personalChatId
        ) {
          await retainOldMessages(
            isGroup ? idWithUpdate : idWhoSentTheMessage,
            isGroup
          );
          await retainOldConversations();

          // await seenProcedure(
          //   isGroup ? idWithUpdate : idWhoSentTheMessage,
          //   isGroup,
          //   idWhoSentTheMessage
          // );
        } else {
          await retainOldConversations();
        }
      }
    );

    socket.on("your-last-message-is-seen", ({ inWhichChatId, isGroup }) => {
      console.log("Inside your-last-message-is-seen");
      setArray((prev) => {
        const index = prev.findIndex((val) => {
          return val._id === inWhichChatId;
        });
        console.log(prev);
        prev[index].lastMessage.isNotSeen = false;
        return [...prev];
      });
    });

    socket.on("new-group-created", (_id, onlineMembers) => {
      console.log(_id, onlineMembers);
      socket.emit("in-new-group", _id, onlineMembers);
      retainOldConversations();
    });
  }, [retainOldMessages, retainOldConversations]);

  // to send a message to first database and then the callback value is used to sent back to socket server
  const sendMessages = async (recieverObj) => {
    try {
      const dataToSend = {
        sender: userName,
        _id,
        timestamp: new Date(),
        message: recieverObj.sendMessage,
        isNotSeen: true,
      };
      const sendInfo = JSON.stringify({
        _id1: _id,
        _id2: recieverObj._id,
        isGroup: recieverObj.admins ? true : false,
      });
      const msg = await axios.put(`/inbox/chatbox/${sendInfo}`, dataToSend);
      console.log(msg.data);
      if (msg.data.token) setAuthenticated(false);
      if (msg.data.newPersonalChat) {
        const newPersonalChat = msg.data.newPersonalChat;
        socket.emit(
          "new-room-creation",
          {
            personalChatId: newPersonalChat._id,
            senderId: newPersonalChat.users[0],
            receiverId: newPersonalChat.users[1],
          },
          ({ id, socketId }) => {
            if (id && socketId) {
              setTotalOnlineUsersCurrently((prevVal) => {
                let onlineUsers = new Map(prevVal);
                onlineUsers.set(id, 1);
                return onlineUsers;
              });
            }
          }
        );
        // setActiveInfo((prevVal) => {
        //   return {
        //     ...prevVal,
        //     personalChatId: newPersonalChat._id,
        //   };
        // });
        activeInfo.current = {
          ...activeInfo.current,
          personalChatId: newPersonalChat._id,
        };
        await retainOldMessages(newPersonalChat.users[1], false);
        return newPersonalChat._id + "";
      }
      await retainOldMessages(
        recieverObj._id,
        recieverObj.admins ? true : false
      );
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  //   // when a message is sent by the user
  const messageSender = async (receiverObj) => {
    if (search.length) setSearch("");
    console.log(receiverObj);
    let personalChatId = await sendMessages(receiverObj);
    const payloadToSend = {
      isGroup: receiverObj.admins ? true : false,
      senderId: _id, //personaluser id
      roomId: receiverObj.admins //perchat or groupchat id
        ? receiverObj._id
        : personalChatId
        ? personalChatId
        : receiverObj.personalChatId,
    };
    console.log("send-msg");
    socket.emit("send-message", payloadToSend);
    setMatches([]);
    retainOldConversations();
  };

  //   // functional logic to display time of messages in correct format
  const getTimeToDisplayOnChat = (date) => {
    const d = new Date();
    date = new Date(date);
    let hrs = date.getHours();

    const ampm = `${hrs > 12 ? "pm" : "am"}`;

    hrs %= 12;
    hrs = `${hrs < 10 ? 0 + "" + hrs : hrs}`;

    let min = date.getMinutes();
    min = `${min < 10 ? 0 + "" + min : min}`;

    let day = date.getDate();
    if (day !== d.getDate()) day = `${day < 10 ? 0 + "" + day : day}`;
    else day = false;

    let month = date.toLocaleString("default", { month: "short" });

    let yr = date.getFullYear();

    return `${hrs}:${min} ${ampm} ${day ? month + " " + day : ""}${
      yr !== d.getFullYear() ? " '" + (yr % 100) : ""
    }`;
  };

  //   // to make new group
  const makeGroup = async (groupInfo) => {
    groupInfo.creater = userName;
    try {
      let { data } = await axios.post(`/inbox/makegroup/`, groupInfo);
      if (data.token) setAuthenticated(false);
      console.log(data.data);
      retainOldConversations();
      setLoading(false);
      if (!data.success) socket.emit("new-group-creation", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {authenticated ? (
        <div>
          <Topbar userName={userName} search={search} setSearch={setSearch} />
          <PropsToPassToConversation.Provider
            value={{
              setActive,
              activeInfo,
              retainOldMessages,
              setIsGroup,
              active,
              isGroup,
              userName,
              getTimeToDisplayOnChat,
            }}
          >
            {matches.length ? (
              <Messenger
                friends={matches}
                array={oldChatsArray}
                _id={_id}
                activeInfo={activeInfo}
                messageSender={messageSender}
                getTimeToDisplayOnChat={getTimeToDisplayOnChat}
                search={search}
                setAuthenticated={setAuthenticated}
                makeGroup={makeGroup}
                setSearch={setSearch} //changes
                active={active}
              />
            ) : (
              <Messenger
                friends={friends}
                array={oldChatsArray}
                _id={_id}
                activeInfo={activeInfo}
                getTimeToDisplayOnChat={getTimeToDisplayOnChat}
                messageSender={messageSender}
                setAuthenticated={setAuthenticated}
                search={search}
                makeGroup={makeGroup}
                setSearch={setSearch} //changes
                active={active}
              />
            )}
          </PropsToPassToConversation.Provider>
        </div>
      ) : null}
    </>
  );
};
export default Home;
export {
  PropsToPassToConversation,
  PropsToPassToChat,
  PropsToPassToFriendsLists,
};
