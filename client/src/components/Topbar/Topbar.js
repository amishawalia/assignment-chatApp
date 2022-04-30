import "./Topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import Avatar from '@mui/material/Avatar';
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios';
import { useDispatch } from "react-redux";

const Topbar = ({ userName }) => { //changes
  console.log("topbar");



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
        {/* <div className="topbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input
              value={search}
              onChange={(e) => {
                console.log(e.target.value);
                setSearch(e.target.value);
              }}
            />
          </div>
        </div> */}
        <div className="topbarRight " onClick={() => { axios.get("http://localhost:5000/api/logout").then(response =>{
          console.log(response);
          if (response?.status == 200) {
              dispatch({type:'logout',value:false})
          }
        })}}>


          <Avatar {...stringAvatar(`${userName}`)} />
          <Tooltip title='Logout'>
            <ArrowDropDownIcon />
          </Tooltip>
        </div>
      </div>
    </>
  );
};
export default Topbar;
