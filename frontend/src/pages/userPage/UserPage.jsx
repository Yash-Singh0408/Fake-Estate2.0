import React, { useEffect, useState } from "react";
import "./userPage.scss";
import apiRequest from "../../lib/apiRequest";
import { Trash2, Search } from "lucide-react";
import { toast } from "react-toastify";

function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("latest");
  const [search, setSearch] = useState("");
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  

  const fetchUsers = async () => {
    setLoading(true);

    let sortBy = "createdAt";
    let order = "desc";

    if (sortOption === "oldest") order = "asc";
    else if (sortOption === "listingsAsc") {
      sortBy = "postCount";
      order = "asc";
    } else if (sortOption === "listingsDesc") {
      sortBy = "postCount";
      order = "desc";
    }

    try {
      const res = await apiRequest.get(
        `/admin/users?sortBy=${sortBy}&order=${order}&search=${encodeURIComponent(search)}`
      );
      const nonAdminUsers = res.data.filter((user) => !user.isAdmin);
      setUsers(nonAdminUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortOption]);

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeletingUserId(userToDelete.id);
    try {
      await apiRequest.delete(`/admin/deleteusers/${userToDelete.id}`);
      toast.success("User and all data deleted successfully !");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user.");
      console.error("Delete failed:", err);
    } finally {
      setDeletingUserId(null);
      setShowConfirmModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDelete(null);
  };

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  useEffect(() => {
    if (showConfirmModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showConfirmModal]);
  

  return (
    <div className="userPage">
      <h2 className="pageTitle">All Registered Users</h2>

      <div className="filterSection">
        <div>
          <label>Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latest">Latest Joined</option>
            <option value="oldest">Oldest Joined</option>
            <option value="listingsAsc">Listings (Low to High)</option>
            <option value="listingsDesc">Listings (High to Low)</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            type="text"
            placeholder="Search by username or email"
            value={search}
            onChange={handleSearchChange}
          />
          <button type="submit">
            <Search />
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <div className="noResults">
          <Search size={64} color="#ccc" strokeWidth={1.5} />
          <p>No results found</p>
        </div>
      ) : (
        <table className="userTable">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Avatar</th>
              <th>Username</th>
              <th>Email</th>
              <th>Joined</th>
              <th>Listings</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td className="center">{index + 1}</td>
                <td>
                  <img
                    src={user.avatar || "/noavatar.jpg"}
                    alt={user.username}
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: "center" }}>{user.postCount}</td>
                <td className="center actionBtns">
                  <button
                    onClick={() => handleDeleteClick(user)}
                    disabled={deletingUserId === user.id}
                  >
                    {deletingUserId === user.id ? (
                      <div className="spinner small" />
                    ) : (
                      <Trash2 size={18} color="red" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/*  Custom Confirm Delete Modal */}
      {showConfirmModal && userToDelete && (
        <div className="confirmModal1">
          <div className="modalContent1">
            <h4>Confirm Deletion</h4>
            <p>
              Are you sure you want to delete <strong>{userToDelete.username}</strong>?
            </p>
            <div className="modalActions">
              <button onClick={confirmDelete} className="confirmBtn">
                {deletingUserId === userToDelete.id ? (
                  <div className="spinner small" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
              <button onClick={cancelDelete} className="cancelBtn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
