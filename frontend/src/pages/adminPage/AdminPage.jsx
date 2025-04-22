import React, { useEffect, useState } from 'react';
import './adminPage.scss';
import apiRequest from '../../lib/apiRequest';
import { Users, Building2, FileText, Shield } from 'lucide-react';

function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="adminPage">
      <h1>Dashboard Overview</h1>

      <div className="statsSection">
        <div className="statCard">
          <div className="icon"><Users /></div>
          <div className="details">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="statCard">
          <div className="icon"><Building2 /></div>
          <div className="details">
            <h3>{stats.totalProperties}</h3>
            <p>Properties</p>
          </div>
        </div>
        <div className="statCard">
          <div className="icon"><FileText /></div>
          <div className="details">
            <h3>{stats.totalRequests || 124}</h3>
            <p>Requests</p>
          </div>
        </div>
        <div className="statCard">
          <div className="icon"><Shield /></div>
          <div className="details">
            <h3>{stats.totalAdmins}</h3>
            <p>Admins</p>
          </div>
        </div>
      </div>

      <div className="sectionTitle">Latest Users</div>
      <div className="userList">
        {stats.latestUsers.map((user) => (
          <div className="userCard" key={user.id}>
            <img src={user.avatar || '/noavatar.jpg'} alt={user.username} />
            <div className="info">
              <h4>{user.username}</h4>
              <p>{user.email}</p>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="sectionTitle">Recent Requests</div>
      <div className="requestList">
        <div className="requestItem">John submitted a request for listing approval.</div>
        <div className="requestItem">Jane submitted a property edit request.</div>
        <div className="requestItem">Ali reported a bug in the payment flow.</div>
      </div>
    </div>
  );
}

export default AdminPage;
