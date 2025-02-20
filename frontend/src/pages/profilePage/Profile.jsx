import React from "react";
import "./profile.scss";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import { Link , useNavigate} from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function Profile() {

  const navigate = useNavigate();

  const hadleLogout = async () => {

    try {
      // APi req to logout
      const res =  apiRequest.post('/auth/logout');
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <button>Update Profile</button>
          </div>
          <div className="info">
            <span>Avatar :
            <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
            </span>
            <span>User : <b>Yash Singh</b></span>
            <span>Email : 0sKdD@example.com</span>
            <button onClick={hadleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My Listing</h1>
            <button>Create New Post</button>
          </div>
          <List />
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <List />
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Chat/>
        </div>
      </div>
    </div>
  );
}

export default Profile;
