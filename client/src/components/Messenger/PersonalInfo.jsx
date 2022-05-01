import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import CoPresentSharpIcon from "@mui/icons-material/CoPresentSharp";
import GroupIcon from "@mui/icons-material/Group";
import { useEffect, useState } from "react";
import axios from "../../axios";
import { StepIcon } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';


const PersonalInfo = ({ selfId, idOfPerson }) => {
  const [user, setuser] = useState({});

  useEffect(() => {
    const fdata = async () => {
      try {
        const obj = {
          selfId,
          idOfPerson,
        };
        const res = await axios.get(
          "/inbox/personalinfo/" + JSON.stringify(obj)
        );
        console.log(res.data);
        setuser(res.data);
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
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary={"Name"} secondary={user.userName} />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <CoPresentSharpIcon />
        </ListItemIcon>
        <ListItemText primary={"About"} secondary={"Available"} />
      </ListItem
      >
      <ListItem>
        <ListItemIcon>
          <EmailIcon/>
        </ListItemIcon>
        <ListItemText primary={"Email"} secondary={user.email} />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <PhoneIcon/>
        </ListItemIcon>
        <ListItemText primary={"Phone"} secondary={user.phone} />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <WcIcon/>
        </ListItemIcon>
        <ListItemText primary={"Gender"} secondary={user.gender} />
      </ListItem>

      <ListItem>
        <ListItemIcon>
          <GroupIcon />
        </ListItemIcon>
        <ListItemText primary={"Groups in common"} />
        <div className="memberList">
          {user?.groupsInCommon?.map((u) => (
            <h6>{u?.name}</h6>
          ))}
        </div>
      </ListItem>
    </>
  );
};

export default PersonalInfo;
