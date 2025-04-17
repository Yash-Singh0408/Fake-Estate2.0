import { Suspense, useContext } from "react";
import "./profile.scss";
import List from "../../components/list/List";
import Chat from "../../components/chat/Chat";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import MessageSkeleton from "../../components/skeleton/MessageSkeleton";
import SkeletonCard from "../../components/skeleton/SkeletonCard";
import { toast } from "react-toastify";
import { FaRegFolderOpen, FaRegBookmark, FaRegComments } from "react-icons/fa";

function Profile() {
  const data = useLoaderData();

  // console.log(data);

  const navigate = useNavigate();
  const { currentUser, updateUser } = useContext(AuthContext);
  const hadleLogout = async () => {
    try {
      // APi req to logout
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
      toast.success("Logged out successfully!");
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

          <Suspense fallback={<SkeletonCard />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.userPosts.length > 0 ? (
                  <List posts={postResponse.data.userPosts} />
                ) : (
                  <div className="emptyState">
                    <FaRegFolderOpen
                      size={60}
                      color="#ccc"
                      style={{ marginBottom: "1rem" }}
                    />
                    <p>You haven&apos;t created any posts yet.</p>
                  </div>
                )
              }
            </Await>
          </Suspense>

          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<SkeletonCard />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.savedPost.length > 0 ? (
                  <List posts={postResponse.data.savedPost} />
                ) : (
                  <div className="emptyState">
                    <FaRegBookmark
                      size={60}
                      color="#ccc"
                      style={{ marginBottom: "1rem" }}
                    />
                    <p>No saved posts yet. Start exploring!</p>
                  </div>
                )
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <div className="section">
            <div className="title">
              <h1>Messages</h1>
            </div>
            <Suspense fallback={<MessageSkeleton />}>
              <Await
                resolve={data.chatResponse}
                errorElement={<p>Error loading chats!</p>}
              >
                {(chatResponse) =>
                  chatResponse.data.length > 0 ? (
                    <Chat chats={chatResponse.data} />
                  ) : (
                    <div className="emptyState">
                      <FaRegComments size={60} color="#ccc" />
                      <p>No chats yet. Start a conversation!</p>
                    </div>
                  )
                }
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
