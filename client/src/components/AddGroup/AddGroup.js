import { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";
// import { FormControlLabel } from "@mui/material";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@mui/material/FormGroup";
// import Switch from "@mui/material/Switch";
import { FormControlLabel, Switch } from "@material-ui/core";
import "./AddGroup.css";
import { Button } from "@material-ui/core";
import axios from "../../axios";
const AddGroup = ({ _id, setAuthenticated, makeGroup, handleCloseModal }) => {
  const [groupName, setGroupName] = useState("");
  const [aboutGroup, setAboutGroup] = useState("");
  const [users, setusers] = useState([]);
  const [members, setmembers] = useState([]);
  const [admins, setadmins] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const u = await axios.get(`inbox/friends/${_id}`);
        if (u.data.token) setAuthenticated(false);
        console.log(u.data);
        setusers(u.data);
        setmembers(new Array(users.length).fill(false));
        console.log(members.length);
        setadmins(new Array(users.length).fill(false));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleAbout = (event) => {
    setAboutGroup(event.target.value);
  };
  const handleName = (event) => {
    setGroupName(event.target.value);
  };

  const btnstyle = { margin: "8px 0" };
  return (
    <>
      <p>Please fill the details to create a group</p>
      <TextField
        fullWidth
        label="Group Name"
        onChange={handleName}
        value={groupName}
        name="groupName"
        placeholder="Enter group name"
        required
      />
      <br></br>
      <TextField
        fullWidth
        label="About"
        onChange={handleAbout}
        value={aboutGroup}
        name="about"
        placeholder="Enter group info"
        required
      />
      <br></br>
      <p>Add members to the group</p>
      <div className="groupMembers">
        {users.map((friend, index) => {
          return (
            <div key={index} className="groupMember">
              <div style={{ width: "150px" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      color="primary"
                      id="member"
                      name={index}
                      value={members[index]}
                      onClick={(e) => {
                        setmembers((prev) => {
                          prev[index] = !prev[index];

                          return prev;
                        });
                        console.log(members);
                      }}
                    />
                  }
                  label={friend.userName}
                />
              </div>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      inputProps={{ "aria-label": "controlled" }}
                      checked={admins[index]}
                      //   name={index}
                      onChange={(e) => {
                        setadmins((prev) => {
                          prev[index] = !prev[index];
                          return prev;
                        });
                        console.log(admins);
                      }}
                    />
                  }
                  label="Admin"
                />
              </FormGroup>
              <br></br>
            </div>
          );
        })}
      </div>
      <Button
        type="submit"
        color="primary"
        variant="contained"
        style={btnstyle}
        fullWidth
        /* onClick={handleLogin} */
        onClick={async () => {
          let groupInfo = {
            name: groupName,
            about: aboutGroup,
            admins: [_id],
            members: [_id],
          };
          for (let i = 0; i < users.length; i++) {
            if (members[i]) {
              groupInfo.members.push(users[i]._id);
              if (admins[i]) {
                groupInfo.admins.push(users[i]._id);
              }
            }
          }

          console.log(groupInfo);
          await makeGroup(groupInfo);
          handleCloseModal();
        }}
      >
        Create Group
      </Button>
    </>
  );
};
export default AddGroup;
