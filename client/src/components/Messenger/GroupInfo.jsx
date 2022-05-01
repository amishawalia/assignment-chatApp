import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CoPresentSharpIcon from "@mui/icons-material/CoPresentSharp";
import { useState, useEffect } from "react";
import axios from "../../axios";

const GroupInfo = ({ idOfGroup }) => {
  const [group, setgroup] = useState({});

  useEffect(() => {
    const fdata = async () => {
      try {
        const res = await axios.get("/inbox/groupinfo/" + idOfGroup);
        console.log(res.data);
        setgroup(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fdata();
  }, []);

  return (
    <>
      <ListItem>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary={"Group"} secondary={group.groupName} />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <CoPresentSharpIcon />
        </ListItemIcon>
        <ListItemText primary={"About"} secondary={group.groupAbout} />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <AdminPanelSettingsIcon/>
        </ListItemIcon>
        <ListItemText primary={"Admins"} />
        <div className="adminList">
          {group?.admins?.map((u) => (
            <h6>{u?.userName}</h6>
          ))}
        </div>
      </ListItem>
      
      <ListItem>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary={"Members"} />
        <div className="groupMembersList">
          {group?.members?.map((u) => (
            <h6>{u?.userName}</h6>
          ))}
        </div>  
      </ListItem>
    </>
  );
};

export default GroupInfo;
