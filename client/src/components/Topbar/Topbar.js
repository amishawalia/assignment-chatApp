import "./Topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { useDispatch } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Logout from "@mui/icons-material/Logout";
import Popover from "@mui/material/Popover";

const Topbar = ({ userName }) => {
  //changes
  const [user, setuser] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [toggleProfile, setToggleProfile] = useState(false);
  // modal
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // popup
  const [anchorElPopup, setAnchorElPopup] = useState(null);

  const handlePopupClose = () => {
    setAnchorElPopup(null);
  };

  const openPopup = Boolean(anchorElPopup);
  const id = open ? "simple-popover" : undefined;

  // logout
  const handleLogout = () => {
    axios.get("http://localhost:5000/api/logout").then((response) => {
      console.log(response);
      if (response?.status === 200) {
        dispatch({ type: "logout", value: false });
      }
    });
  };

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: "white",
        color: "black",
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
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
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
                overflow: "visible",
                backgroundColor: "#dbd9d9",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
          >
            <MenuItem>
              <div
                onClick={(event) => {
                  const fdata = async () => {
                    try {
                      const res = await axios.get(
                        "/inbox/selfinfo/" + userName
                      );
                      console.log(res.data);
                      setuser(res.data);
                      // se(res.data);
                    } catch (error) {
                      console.log(error);
                    }
                  };
                  fdata();
                  setToggleProfile(!toggleProfile);
                  console.log(toggleProfile);
                  setAnchorElPopup(event.currentTarget);
                }}
                style={{ display: "flex" }}
              >
                <Avatar {...stringAvatar(`${userName}`)} />
                Profile
                {toggleProfile && (
                  <div className="profileWrapper">
                    <Popover
                      id={id}
                      open={openPopup}
                      anchorEl={anchorElPopup}
                      onClose={handlePopupClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <div class="profileCard">
                        <header className="profileCardHeader">
                          <h4>{userName}</h4>

                          <img src="/assets/avatar.png" class="profileAvatar" />
                        </header>
                        <footer className="profileCardFooter">
                          <ul class="list-unstyled">
                            <li>Email: {user?.email}</li>
                            <li>Phone: {user?.phone}</li>
                            <li>About: {user?.about}</li>
                            <li>Gender: {user?.gender}</li>
                          </ul>
                        </footer>
                      </div>
                    </Popover>
                  </div>
                )}
              </div>
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
