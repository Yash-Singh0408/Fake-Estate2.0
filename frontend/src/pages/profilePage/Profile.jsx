import { useContext, useEffect } from "react";
import "./profile.scss";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

function Profile() {
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);
  const hadleLogout = async () => {
    try {
      // APi req to logout
      await apiRequest.post("/auth/logout");
      updateUser(null);
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
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar :
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>
              User : <b>{currentUser.username}</b>
            </span>
            <span>Email : {currentUser.email}</span>
            <button onClick={hadleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>My Listing</h1>
            <Link to="/profile/addpost">
              <button>Create New Post</button>
            </Link>
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
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default Profile;
