import "./Conversation.css";
import { useContext } from "react";
import { PropsToPassToConversation } from "../../Pages/Home/Home";
import { DoneAllIcon, InsertPhotoRoundedIcon } from "./Icons";
import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { fontSize } from "@mui/system";
import BadgeAvatars from "./BadgeAvatar";

const Conversation = ({ obj }) => {
  //   console.log(props);
  const {
    setActive,
    activeInfo,
    retainOldMessages,
    // setIsGroup,
    active,
    userName,
    getTimeToDisplayOnChat,
    // seenProcedure,
  } = useContext(PropsToPassToConversation);

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        color: "white",
        height: "50px",
        width: "50px",
        marginRight: "10px",
      },
      children: `${name.toUpperCase().charAt(0)}`,
    };
  }
  /*   function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "white",
        color: "black"
      },
      children: `${name.toUpperCase().charAt(0)}`,
    };
  } */

  return (
    <>
      <div
        onClick={() => {
          setActive(true);
          console.log("inside", obj);
          // setActiveInfo({ ...val });
          activeInfo.current = obj;
          console.log(activeInfo.current);
          retainOldMessages(obj._id, obj.admins ? true : false);
          // setTimeout(() => document.getElementById("send-message").focus(), 1000);
        }}
        className="card"
        tabIndex="0"
      >
        {obj.admins ? (
          <div
            className={active === obj._id ? "card_item active" : "card_item"}
          >
            {/* <Avatar {...stringAvatar(`${obj.userName}`)} /> */}
            <BadgeAvatars userName={obj.name} isOnline={false} />
            <div className="card_item-info">
              <div>
                <h3>{obj.name}</h3>
                <p>
                  {(obj?.lastMessage?.sender === userName
                    ? "You: "
                    : `${obj?.lastMessage?.sender}: `) +
                    obj?.lastMessage?.message}
                </p>
              </div>
              <div className="card_item-info_meta">
                {obj?.lastMessage?.timestamp && (
                  <p>{getTimeToDisplayOnChat(obj?.lastMessage?.timestamp)}</p>
                )}
                {/* 
              {obj.isOnline ? (
                <span className="online"></span>
              ) : // <span className="offline"></span>
              null} */}
              </div>
              {/* </>) : null} */}
            </div>
          </div>
        ) : (
          <div
            className={active === obj._id ? "card_item active" : "card_item"}
          >
            {/* <Avatar {...stringAvatar(`${obj.userName}`)} /> */}
            <BadgeAvatars userName={obj.userName} isOnline={obj.isOnline} />
            <div className="card_item-info">
              {/* {obj.lastMessage ? (<> */}

              <div>
                <h3>{obj.userName}</h3>{" "}
                <p>
                  {(obj?.lastMessage?.sender === userName
                    ? "You: "
                    : "They: ") + obj?.lastMessage?.message}
                </p>
              </div>
              <div className="card_item-info_meta">
                {obj?.lastMessage?.timestamp && (
                  <p>{getTimeToDisplayOnChat(obj?.lastMessage?.timestamp)}</p>
                )}
                {/* 
              {obj.isOnline ? (
                <span className="online"></span>
              ) : // <span className="offline"></span>
              null} */}
              </div>
              {/* </>) : null} */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default Conversation;
