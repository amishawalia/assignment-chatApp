import "./Message.css";
import Avatar from '@mui/material/Avatar';

const Message = ({ own, obj, getTimeToDisplayOnChat }) => {
  console.log(obj);
  function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
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
        color : "white",
        height: "50px",
        width: "50px",
        marginRight: "10px"
      },
      children: `${name.toUpperCase().charAt(0)}`,
    };
  }
  return (
    <>
      <div className={own ? "message own" : "message"}>
        <div className="messageTop">
        <Avatar {...stringAvatar(`${obj.sender}`)} />
          <p className="messageText">
            {obj.message ? obj.message : "Dummy msg"}
          </p>
        </div>
        <div className="messageBottom">
          {getTimeToDisplayOnChat(obj.timestamp)}
        </div>
      </div>
    </>
  );
};
export default Message;
