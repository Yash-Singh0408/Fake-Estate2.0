import React, { useContext, useState } from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { ToastContainer, toast } from "react-toastify";

function ProfileUpdatePage() {
  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.put(`/users/updateUser/${currentUser.id}`, {
        username,
        email,
        password,
        avatar: avatar[0] || currentUser.avatar,
      });
      updateUser(res.data);
      toast.success("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="profileUpdatePage">
      <ToastContainer position="top-center" />
      <div className="updateCard">
        <div className="leftSection">
          <img
            className="avatar"
            src={avatar[0] || currentUser.avatar || "/noavatar.jpg"}
            alt="avatar"
          />
          <UploadWidget
            uwConfig={{
              cloudName: "djq7gjuo0",
              uploadPreset: "FakeEstate",
              multiple: "false",
              maxImageFileSize: 2000000,
              folder: "avatars",
            }}
            setState={setAvatar}
          />
        </div>

        <div className="rightSection">
          <form onSubmit={handleSubmit}>
            <h2>Edit Your Profile</h2>
            <div className="formGroup">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={currentUser.username}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={currentUser.email}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" />
            </div>
            <button className="updateBtn" type="submit">Update</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
