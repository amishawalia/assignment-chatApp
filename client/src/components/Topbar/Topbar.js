import "./Topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import Avatar from '@mui/material/Avatar';
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useDispatch } from "react-redux";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Logout from '@mui/icons-material/Logout';

const Topbar = ({ userName }) => { //changes

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    axios.get("http://localhost:5000/api/logout").then(response => {
      console.log(response);
      if (response?.status == 200) {
        dispatch({ type: 'logout', value: false })
      }
    })
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "white",
        color: "black"
      },
      children: `${name.toUpperCase().charAt(0)}`,
    };
  }

  const dispatch = useDispatch();
  return (
    <>
      <div className="topbarContainer">
        <div className="topbarLeft">
          <span className="logo"> {` ${userName}`}</span>
        </div>
        <h1 className="head">ChatApp</h1>
        <div className="topbarRight ">


          {/* <Avatar {...stringAvatar(`${userName}`)} />
          <Tooltip title='Logout'>
            <ArrowDropDownIcon />
          </Tooltip> */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar {...stringAvatar(`${userName}`)} />

            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            // onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                backgroundColor : '#dbd9d9',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              }
            }}

          >
            <MenuItem>
            <Avatar {...stringAvatar(`${userName}`)} />Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
    </>
  );
};
export default Topbar;


// onClick={() => { axios.get("http://localhost:5000/api/logout").then(response =>{
//           console.log(response);
//           if (response?.status == 200) {
//               dispatch({type:'logout',value:false})
//           }
//         })}}