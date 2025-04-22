import  { useEffect, useState } from "react";
import "./adminlistPage.scss";
import apiRequest from "../../lib/apiRequest";
import { Search } from "lucide-react";
import CustomModal from "../../components/customModal/CustomModal";

function AdminlistPage() {
  const [listings, setListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("latest");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [updating, setUpdating] = useState(null); // stores post ID being updated

  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        sortBy: sortOption,
      });

      if (selectedStatus !== "all") {
        query.append("status", selectedStatus);
      }

      const res = await apiRequest.get(`/admin/getAllListings?${query.toString()}`);
      setListings(res.data);
    } catch (err) {
      console.error("Error fetching listings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [sortOption, searchTerm, selectedStatus]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const updateStatus = async (postId, status) => {
    setUpdating(postId);
    try {
      await apiRequest.put(`/admin/updateStatus/${postId}`, { status });
      fetchListings();
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setUpdating(null);
    }
  };

  const openModal = (post) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  return (
    <div className="adminlistPage">
      <h2 className="pageTitle">Manage Listings</h2>

      <div className="filterSection">
        <div>
          <label>Sort by:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="priceAsc">Price (Low to High)</option>
            <option value="priceDesc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <form onSubmit={handleSearchSubmit} className="searchForm">
          <input
            type="text"
            placeholder="Search by title or city"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">
            <Search />
          </button>
        </form>
      </div>

      {loading ? (
        <p>Loading listings...</p>
      ) : listings.length === 0 ? (
        <div className="noResults">
          <Search size={64} color="#ccc" strokeWidth={1.5} />
          <p>No results found</p>
        </div>
      ) : (
        <table className="adminTable">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Title</th>
              <th>City</th>
              <th>Price</th>
              <th>Type</th>
              <th>Property</th>
              <th>Posted</th>
              <th>User</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((post, index) => (
              <tr key={post.id}>
                <td className="center">{index + 1}</td>
                <td>
                  <button
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => openModal(post)}
                    className="viewBtn"
                  >
                    {post.title}
                  </button>
                </td>
                <td>{post.city}</td>
                <td>${post.price.toLocaleString()}</td>
                <td>{post.type}</td>
                <td>{post.property}</td>
                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                <td>{post.user?.username}</td>
                <td className={`statusCell ${post.status}`} style={{ marginTop: "6px" }} >{post.status}</td>
                <td>
                  {post.status === "pending" ? (
                    <div className="actionBtns">
                      <button
                        disabled={updating === post.id}
                        onClick={() => updateStatus(post.id, "approved")}
                        className="approveBtn"
                      >
                        {updating === post.id ? "Approving..." : "Approve"}
                      </button>
                      <button
                        disabled={updating === post.id}
                        onClick={() => updateStatus(post.id, "rejected")}
                        className="rejectBtn"
                      >
                        {updating === post.id ? "Rejecting..." : "Reject"}
                      </button>
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <CustomModal isOpen={!!selectedPost} onClose={closeModal} post={selectedPost} />
    </div>
  );
}

export default AdminlistPage;
