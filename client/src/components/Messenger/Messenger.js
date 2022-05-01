import { useState, useRef, useEffect } from "react";
import ChatOnline from "../ChatOnline/ChatOnline";
import Conversation from "../Conversation/Conversation";
import Message from "../Message/Message";
import "./Messenger.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AddGroup from "../AddGroup/AddGroup";
import InfoIcon from "@mui/icons-material/Info";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CoPresentSharpIcon from "@mui/icons-material/CoPresentSharp";

const Messenger = ({
  friends,
  array,
  _id,
  setAuthenticated,
  activeInfo,
  messageSender,
  getTimeToDisplayOnChat,
  search,
  makeGroup,
  setSearch, //changes
}) => {
  const [sendMessage, setSendMessage] = useState("");
  const [toggleGroupButton, setGroupButtonToggle] = useState(false);
  const [toggleInfo, setToggleInfo] = useState(false);

  const checkGroup = true;
  const checkAdmin = true;
  console.log(array);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };
  const enterHandler = (event) => {
    if (event.keyCode === 13) {
      if (sendMessage !== "") {
        setSendMessage("");
        const obj = activeInfo.current;
        console.log(obj);
        messageSender({ ...obj, sendMessage });
      }
    }
  };

  const addGroupIcon = {
    color: "white",
    fontSize: "40px",
  };
  const handleCloseModal = () => {
    setGroupButtonToggle(false);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const infoStyle = {
    position: "absolute",
    top: "43%",
    left: "40%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const listStyle = {
    display: "flex",
  };
  useEffect(scrollToBottom, [array]);
  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <div className="chatMenuTop">
              <input
                value={search}
                className="inputfield"
                placeholder="Search for friend or a group"
                onChange={(e) => {
                  console.log(e.target.value);
                  setSearch(e.target.value);
                }}
              />
            </div>
            <div className="chatMenuCenter">
              {friends.map((user) => {
                // console.log(user);
                return <Conversation key={user._id} obj={user} />;
              })}
            </div>
            <div
              className="chatMenuBottom"
              onClick={() => setGroupButtonToggle(!toggleGroupButton)}
            >
              <AddCircleIcon style={addGroupIcon} />
              <span className="addgrouptitle">Tap to create group</span>
            </div>
            {toggleGroupButton && (
              <Modal
                open={toggleGroupButton}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <Box sx={style}>
                  <AddGroup
                    friends={friends}
                    setAuthenticated={setAuthenticated}
                    _id={_id}
                    makeGroup={makeGroup}
                    handleCloseModal={handleCloseModal}
                  />
                </Box>
              </Modal>
            )}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <InfoIcon
              onClick={() => {
                setToggleInfo(!toggleInfo);
              }}
            />

            {toggleInfo && (
              <Modal
                open={toggleInfo}
                onClose={() => {
                  setToggleInfo(false);
                }}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <Box sx={infoStyle}>
                  <div className="infoWrapper">
                    <List>
                      {checkGroup ? (
                        <>
                          <ListItem>
                            <ListItemIcon>
                              <GroupIcon />
                            </ListItemIcon>
                            <ListItemText primary={"GroupName"} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CoPresentSharpIcon />
                            </ListItemIcon>
                            <ListItemText primary={"About"} />
                          </ListItem>
                          <div className="nestedList">
                            {friends.map((friend) => {
                              return (
                                <>
                                  <List style={listStyle}>
                                    <ListItem>
                                      <ListItemIcon>
                                        <PersonIcon />
                                      </ListItemIcon>
                                      <ListItemText primary={friend.userName} />
                                    </ListItem>
                                    {checkAdmin && (
                                      <AdminPanelSettingsIcon
                                        style={{
                                          marginTop: "10px",
                                          color: "#1877f2",
                                        }}
                                      />
                                    )}
                                  </List>
                                </>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <ListItem>
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText primary={"SingleUser"} />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CoPresentSharpIcon />
                            </ListItemIcon>
                            <ListItemText primary={"About"} />
                          </ListItem>
                        </>
                      )}
                    </List>
                  </div>
                </Box>
              </Modal>
            )}

            <div className="chatBoxTop">
              {array
                .slice(0)
                // .reverse()
                .map((obj) => {
                  return (
                    <Message
                      obj={obj}
                      own={obj._id === _id}
                      getTimeToDisplayOnChat={getTimeToDisplayOnChat}
                    />
                  );
                })}
              <div ref={messagesEndRef} id="refId" />
            </div>
            <div className="chatBoxBottom">
              <textarea
                className="chatMessageInput"
                placeholder="write a message"
                value={sendMessage}
                onKeyDown={enterHandler}
                onChange={(e) => setSendMessage(e.target.value)}
              />
              <button
                className="chatSubmitButton"
                onClick={(e) => {
                  if (sendMessage !== "") {
                    setSendMessage("");
                    const obj = activeInfo.current;
                    console.log(obj);
                    messageSender({ ...obj, sendMessage });
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        {/*         <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline />
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Messenger;
