import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = ({ handleChange }) => {
  const dispatch = useDispatch();
  const paperStyle = {
    padding: 20,
    height: "55vh",
    width: 300,
    margin: "0 auto",
  };
  const avatarStyle = { backgroundColor: "#1bbd7e" };
  const btnstyle = { margin: "8px 0" };

  const [user, setUser] = useState({
    userName: localStorage.getItem("username"),
    password: "",
  });
  const [error, setError] = useState("");
  const handleUser = (e) => {
    setUser((prev) => {
      console.log(e.target.value);
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleLogin = async () => {
    try {
      const checked = document.getElementById("remember");
      console.log(checked.checked);

      const data = { userName: user.userName, password: user.password };
      const res = await axios.post("http://localhost:5000/api/login", data, {
        withCredentials: true,
      });
      if (res?.status === 200) {
        dispatch({ type: "signIn", value: res.data });
        setError("");
      }
      if (checked?.checked) {
        localStorage.setItem("username", user.userName);
      } else {
        localStorage.setItem("username", "");
      }
    } catch (error) {
      console.log("here", error);
      setError("Credentials don't match");
    }
  };

  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <TextField
          fullWidth
          label="UserName"
          onChange={handleUser}
          value={user.userName}
          name="userName"
          placeholder="Enter your name"
          required
        />
        <small style={{ float: "right", color: "red" }}>{error}</small>

        <TextField
          fullWidth
          label="Password"
          name="password"
          placeholder="Enter your password"
          onChange={handleUser}
          value={user.password}
          required
          type={"password"}
        />
        <small style={{ float: "right", color: "red" }}>{error}</small>

        <FormControlLabel
          control={<Checkbox name="checkedB" color="primary" id="remember" />}
          label="Remember me"
        />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={btnstyle}
          fullWidth
          onClick={handleLogin}
        >
          Sign in
        </Button>
        <Typography component={"div"}>
          <Link href="#">Forgot password ?</Link>
        </Typography>
        <Typography component={"div"}>
          {" "}
          Do you have an account ?
          <Link href="#" onClick={() => handleChange("event", 1)}>
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  );
};

export default Login;
