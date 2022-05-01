import React, { useEffect, useState } from "react";
import axios from "../axios";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
const Signup = (props) => {
  const paperStyle = { padding: 20, width: 300, margin: "0 auto" };
  const headerStyle = { margin: 0 };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const marginTop = { marginTop: 5 };

  const [user, setuser] = useState({
    userName: "",
    email: "",
    phone: "",
    gender: "male",
    password: "",
    cnfpass: "",
  });
  const [error, seterror] = useState({
    phone: "",
    password: "",
  });
  const [signUpError, setSignUpError] = useState("");
  const containsSpecialChar = (password) => {
    var format = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>?~]/;
    return format.test(password);
  };
  const handleChange = (e) => {
    setuser((prev) => {
      console.log(e.target.value);
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    seterror({ phone: "", password: "" });
    if (
      user.password === user.cnfpass &&
      containsSpecialChar(user.password) &&
      user.password.length >= 8
    ) {
      if (isNaN(user.phone) || user.phone.length !== 10) {
        seterror({ ...error, phone: "Invalid phone number" });
        // console.log(error);
        // alert(error);
      } else {
        try {
          let d = user;
          console.log(d);
          delete d["cnfpass"];
          const r = await axios.post("http://localhost:5000/api/signup", d, {
            withCredentials: true,
          });
          console.log(r.data);
          props.updateStatus(true);
        } catch (error) {
          console.log(error);
          setSignUpError(error?.response?.data);
        }
      }
    } else {
      if (isNaN(user.phone) || user.phone.length !== 10) {
        seterror({
          password: "Invalid password format",
          phone: "Invalid phone number",
        });
      } else {
        seterror({ ...error, password: "Invalid password format" });
      }
    }
  };

  useEffect(() => {
    console.log(error);
  }, [error]);
  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 style={headerStyle}>Sign Up</h2>
          <Typography variant="caption" gutterBottom component={"div"}>
            Please fill this form to create an account !
          </Typography>
        </Grid>
        <form onSubmit={submitHandler}>
          <TextField
            fullWidth
            label="UserName"
            onChange={handleChange}
            value={user.userName}
            name="userName"
            placeholder="Enter your name"
            required
          />
          <br></br>
          <TextField
            fullWidth
            name="email"
            label="Email"
            onChange={handleChange}
            value={user.email}
            placeholder="Enter your email"
            type={"email"}
          />
          <br></br>
          <br />
          <FormControl component="fieldset" style={marginTop}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              style={{ display: "initial" }}
              onChange={handleChange}
              value={user.gender}
              required
            >
              <FormControlLabel
                onChange={handleChange}
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                onChange={handleChange}
                value="male"
                control={<Radio />}
                label="Male"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            placeholder="Enter your phone number"
            onChange={handleChange}
            value={user.phone}
            required
          />
          <small style={{ float: "right", color: "red" }}>{error.phone}</small>
          <TextField
            fullWidth
            label="Password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            value={user.password}
            required
            type={"password"}
          />
          <small style={{ float: "right", color: "red" }}>
            {error.password}
          </small>
          <br></br>
          <TextField
            fullWidth
            label="Confirm Password"
            name="cnfpass"
            placeholder="Confirm your password"
            onChange={handleChange}
            value={user.cnfpass}
            required
            type={"password"}
          />
          <small style={{ float: "right", color: "red" }}>
            {error.password}
          </small>
          {error.password ? (
            <small style={{ float: "right" }}>
              Hint: Password must be atleast 8 characters long and have a
              special character
            </small>
          ) : (
            ""
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "5px" }}
          >
            Sign up
          </Button>
          <small style={{ float: "right", color: "red" }}>{signUpError}</small>
        </form>
      </Paper>
    </Grid>
  );
};

export default Signup;
