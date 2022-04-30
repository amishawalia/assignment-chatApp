import { useState, useRef, useEffect } from "react";
import ChatOnline from "../ChatOnline/ChatOnline";
import Conversation from "../Conversation/Conversation";
import Message from "../Message/Message";
import "./Messenger.css";
import {Search } from "@material-ui/icons";

const Messenger = ({
  friends,
  array,
  _id,
  activeInfo,
  messageSender,
  getTimeToDisplayOnChat,
  search, setSearch //changes
}) => {
  const [sendMessage, setSendMessage] = useState("");
  console.log(array);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: "smooth",
    });
  };
 const enterHandler = (event) => {
   if (event.keyCode === 13){
    if (sendMessage !== "") {
      setSendMessage("");
      const obj = activeInfo.current;
      console.log(obj);
      messageSender({ ...obj, sendMessage });
    }
   }

 }

  useEffect(scrollToBottom, [array]);
  return (
    <>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
         
            <input
              value={search}
              className = "inputfield"
              placeholder ="Search for friend"
              onChange={(e) => {
                console.log(e.target.value);
                setSearch(e.target.value);
                
              }}
            />
            
            {friends.map((user) => {
              // console.log(user);
              return <Conversation key={user._id} obj={user} />;
            })}
            
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
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
                onKeyDown= { enterHandler}
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
